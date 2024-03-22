import { UserRefreshClient } from "google-auth-library";
import Project from "../models/projectModel.js";
import FMECA from "../models/FMECAModel.js";
import Safety from "../models/safetyModel.js";
import User from "../models/userModel.js";
import projectPermission from "../models/projectPermissionModel.js";
import { deleteOne } from "./baseController.js";

export async function projectCreation(req, res, next) {
  try {
    const data = req.body;

    const exist = await Project.find({
      projectNumber: data.projectNumber,
      companyId: data.companyId,
      status: "Active",
    });

    if (exist.length == 0) {
      const createData = await Project.create({
        projectName: data.projectName,
        projectDesc: data.projectDesc,
        projectNumber: data.projectNumber,
        projectOwner: data.projectOwner,
        companyId: data.companyId,
      });

      const userData = await User.findOne({ _id: data.userId });

      const projectEdit = {
        isOwner: true,
        createdBy: data.userId,
      };

      if (userData.role === "Employee") {
        const updateProjectData = await Project.findByIdAndUpdate(
          createData.id,
          projectEdit,
          {
            new: true,
            runValidators: true,
          }
        );
      }

      const permissionData = {
        modules: [
          { name: "PBS", type: "Write" },
          { name: "Failure Rate Prediction", type: "Write" },
          { name: "MTTR Prediction", type: "Write" },
          { name: "FMECA", type: "Write" },
          { name: "RBD", type: "Write" },
          { name: "FTA", type: "Write" },
          { name: "PM MRA", type: "Write" },
          { name: "Spare Part Analysis", type: "Write" },
        ],
        accessType: "Write",
        authorizedPersonnel: data.projectOwner,
        createdBy: data.projectOwner,
        projectId: createData._id,
        companyId: data.companyId,
      };
      const createUserPermission = await projectPermission.create(
        permissionData
      );

      res.status(201).json({
        status: "Created",
        message: "Project Created Successfully",
        data: {
          createData,
          createUserPermission,
        },
      });
    } else {
      res.status(208).json({
        message: "Project Already Exist",
        data: {
          exist,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateProjectDetails(req, res, next) {
  try {
    const data = req.body;
    const projectId = req.params.id;

    const exist = await Project.find({ projectNumber: data.projectNumber });

    if (exist.length > 0) {
      const existNumber = exist[0].projectNumber;

      const newNumber = await Project.find({ _id: projectId });

      if (existNumber == newNumber[0].projectNumber) {
        const editDetail = await Project.findByIdAndUpdate(projectId, data, {
          new: true,
          runValidators: true,
        });

        //update oprational phase to fmeca table
        const fmecaData = await FMECA.find({ projectId: projectId });
        const editFmeca = {
          operatingPhase: data.operationalPhase,
        };
        fmecaData.map(async (list) => {
          const updateFmeca = await FMECA.findByIdAndUpdate(
            list._id,
            editFmeca,
            {
              new: true,
              runValidators: true,
            }
          );
        });

        //update oprational phase to Safety table
        const safetyData = await Safety.find({ projectId: projectId });
        const editSafety = {
          operatingPhase: data.operationalPhase,
        };
        safetyData.map(async (list) => {
          const updateSafety = await Safety.findByIdAndUpdate(
            list._id,
            editSafety,
            {
              new: true,
              runValidators: true,
            }
          );
        });
        res.status(201).json({
          message: "Project Updated Successfully",
          editDetail,
        });
      } else {
        res.status(208).json({
          message: "Project Number Already Exist",
          exist,
        });
      }
    } else {
      const editDetail = await Project.findByIdAndUpdate(projectId, data, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        message: "Project Updated Successfully",
        editDetail,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const data = req.body;

    const projectId = req.params.id;

    const editDetail = await Project.findByIdAndUpdate(projectId, data, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: " Updated Project Details Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllProjectList(req, res, next) {
  try {
    const projectData = await Project.find({ status: "Active" })
      .populate("projectOwner")
      .populate("companyId");
    res.status(200).json({
      status: "success",
      message: "Get All Project List Successfully",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const id = req.params.id;

    const projectData = await Project.findOne({ _id: id, status: "Active" })
      .populate("projectOwner")
      .populate("companyId");
    res.status(200).json({
      status: "success",
      message: "Get Project List Successfully",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteProject(req, res, next) {
  try {
    const id = req.params.id;

    const data = await Project.findOne({ _id: id });

    const editedData = {
      status: "Inactive",
    };
    const deleteData = await Project.findByIdAndUpdate(data._id, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "  Project Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompanyUserProjectList(req, res, next) {
  try {
    const data = req.query;
    const projectData = await Project.find({
      companyId: data.companyId,
      status: "Active",
    })
      .populate("projectOwner")
      .populate("companyId");
    res.status(200).json({
      status: "success",
      message: "Get Project List Successfully",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}
