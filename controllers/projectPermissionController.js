import projectPermission from "../models/projectPermissionModel.js";

export async function createProjectPermission(req, res, next) {
  try {
    const data = req.body;

    const exist = await projectPermission.find({
      projectId: data.projectId,
      authorizedPersonnel: data.authorizedPersonnel,
    });

    if (exist.length == 0) {
      const createData = await projectPermission.create({
        modules: data.modules,
        accessType: data.accessType,
        authorizedPersonnel: data.authorizedPersonnel,
        companyId: data.companyId,
        projectId: data.projectId,
        createdBy: data.createdBy,
      });

      res.status(201).json({
        message: "Project Permission Created Successfuly",
        data: {
          createData,
        },
      });
    } else {
      const permissionData = await projectPermission.findOne({ projectId: data.projectId });
      const permissionId = permissionData._id;
      const editedData = {
        modules: data.modules,
        accessType: data.accessType,
        authorizedPersonnel: data.authorizedPersonnel,
        companyId: data.companyId,
        projectId: data.projectId,
        modifiedBy: data.modefiedBy,
      };

      const editDetail = await projectPermission.findByIdAndUpdate(permissionId, editedData, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        message: "  Project Permission Updated Successfully",
        data: {
          editDetail,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function updateProjectPermission(req, res, next) {
  try {
    const data = req.body;
    const permissionId = data.projectPermissionId;
    const editedData = {
      modules: data.modules,
      accessType: data.accessType,
      authorizedPersonnel: data.authorizedPersonnel,
      companyId: data.companyId,
      projectId: data.projectId,
      modifiedBy: data.modefiedBy,
    };

    const editDetail = await projectPermission.findByIdAndUpdate(permissionId, editedData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "  Project Permission Updated Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllProjectPermission(req, res, next) {
  try {
    const projectData = await projectPermission
      .find()
      .populate("authorizedPersonnel")
      .populate("createdBy")
      .populate("modefiedBy")
      .populate("projectId")
      .populate("companyId");

    res.status(201).json({
      message: "Get All Project Permission Lists Successfuly",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectPermission(req, res, next) {
  try {
    const data = req.query;

    const projectData = await projectPermission
      .findOne({ projectId: data.projectId, authorizedPersonnel: data.authorizedPersonnel })
      .populate("authorizedPersonnel")
      .populate("createdBy")
      .populate("modefiedBy")
      .populate("projectId")
      .populate("companyId");

    res.status(200).json({
      status: "success",
      message: "Get Project Details Successfully",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}

// export async function deleteProjectPermission(req, res, next) {
//   try {
//     const id = req.params.id;

//     const data = await projectPermission.findOne({ projectId: id });

//     const editedData = {
//       status: "Inactive",
//     };
//     const deleteData = await projectPermission.findByIdAndUpdate(data._id, editedData, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(201).json({
//       message: "  Project Permission Deleted Successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// }
export async function deleteProjectPermission(req, res, next) {
  try {
    const id = req.params.id;

    const data = await projectPermission.findOne({ projectId: id });

    if (data) {
      const deleteData = await projectPermission.findByIdAndDelete({ _id: data._id });
      res.status(201).json({
        message: "Project Permission Deleted Successfully",
      });
    } else {
      return next(new AppError(404, "fail", "No document found with that id"), req, res, next);
    }
  } catch (error) {
    next(error);
  }
}
export async function getUserMenuList(req, res, next) {
  try {
    const data = req.query;
    const userMenuList = await projectPermission
      .findOne({ authorizedPersonnel: data.userId, projectId: data.projectId })
      .populate("authorizedPersonnel")
      .populate("createdBy")
      .populate("modefiedBy")
      .populate("projectId")
      .populate("companyId");

    res.status(200).json({
      message: "Get User Menu List",
      data: userMenuList,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompanyUserList(req, res, next) {
  try {
    const companyId = req.params.id;

    const companyUser = await projectPermission
      .find({ companyId: companyId })
      .populate("authorizedPersonnel")
      .populate("createdBy")
      .populate("modefiedBy")
      .populate("projectId")
      .populate("companyId");

    res.status(200).json({
      message: "Get Company Users List",
      data: companyUser,
    });
  } catch (error) {
    next(error);
  }
}
