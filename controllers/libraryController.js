import libraries from "../models/libraryModel.js";
import separateLibrary from "../models/seperateLibraryModel.js";
import connectLibrary from "../models/connectLibraryModel.js";
import { deleteOne } from "./baseController.js";

export async function createLibrary(req, res, next) {
  try {
    const data = req.body;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const existData = await libraries.find({
      moduleName: mName,
      projectId: data.projectId,
      companyId: data.companyId,
    });
    let moduleFieldData = [];
    if (mName.test("FMECA")) {
      moduleFieldData.push(
        { key: "Operating Phase", name: "operatingPhase" },
        { key: "Function", name: "function" },
        { key: "Failure Mode", name: "failureMode" },
        // { key: "Search FM", name: "searchFM" },
        {
          key: "Failure Mode Ratio Alpha",
          name: "failureModeRatioAlpha",
        },
        { key: "Cause", name: "cause" },
        { key: "Sub System Effect", name: "subSystemEffect" },
        { key: "System Effect", name: "systemEffect" },
        { key: "End Effect", name: "endEffect" },
        { key: "End Effect Ratio Beta", name: "endEffectRatioBeta" },
        { key: "Safety Impact", name: "safetyImpact" },
        { key: "Reference Hazard Id", name: "referenceHazardId" },
        { key: "Realibility Impact", name: "realibilityImpact" },
        { key: "Service Disruption Time", name: "serviceDisruptionTime" },
        { key: "Frequency", name: "frequency" },
        { key: "Severity", name: "severity" },
        { key: "Risk Index", name: "riskIndex" },
        {
          key: "Detectable Means During Operation",
          name: "detectableMeansDuringOperation",
        },
        {
          key: "Detectable Means To Maintainer",
          name: "detectableMeansToMaintainer",
        },
        { key: "Built In Test", name: "BuiltInTest" },
        { key: "Design Control", name: "designControl" },
        { key: "Maintenance Control", name: "maintenanceControl" },
        { key: "Export Constraints", name: "exportConstraints" },
        {
          key: "Immedite Action During Operational Phase",
          name: "immediteActionDuringOperationalPhase",
        },
        {
          key: "Immedite Action During Non Operational Phase",
          name: "immediteActionDuringNonOperationalPhase",
        },
        { key: "User Field1", name: "userField1" },
        { key: "User Field2", name: "userField2" },
        { key: "User Field3", name: "userField3" },
        { key: "User Field4", name: "userField4" },
        { key: "User Field5", name: "userField5" },
        { key: "User Field6", name: "userField6" },
        { key: "User Field7", name: "userField7" },
        { key: "User Field8", name: "userField8" },
        { key: "User Field9", name: "userField9" },
        { key: "User Field10", name: "userField10" }
      );
    } else if (mName.test("SAFETY")){
      moduleFieldData.push(
        { key: "Mode of Operation", name: "modeOfOperation" },
        { key: "Hazard Cause", name: "hazardCause" },
        { key: "Effect of Hazard", name: "effectOfHazard" },
        { key: "Hazard Clasification", name: "hazardClasification" },
        { key: "Design Assurance Level", name: "designAssuranceLevel" },
        { key: "Means of Detection", name: "meansOfDetection" },
        { key: "Crew Response", name: "crewResponse" },
        { key: "Unique Hazard Identifier", name: "uniqueHazardIdentifier" },
        { key: "Initial Severity", name: "initialSeverity" },
        { key: "Initial Likelihood", name: "initialLikelihood" },
        { key: "Initial Risk Level", name: "initialRiskLevel" },
        { key: "Design Mitigation", name: "designMitigation" },
        { key: "Design Mitigation Responsibility", name: "designMitigatonResbiity" },
        { key: "Design Mitigation Evidence", name: "designMitigtonEvidence" },
        { key: "Opernal Maintain Mitigation", name: "opernalMaintanMitigation" },
        { key: "Opernal Mitigation Responsibility", name: "opernalMitigatonResbility" },
        { key: "Operatnal Mitigation Evidence", name: "operatnalMitigationEvidence" },
        { key: "Residual Severity", name: "residualSeverity" },
        { key: "Residual Likelihood", name: "residualLikelihood" },
        { key: "Residual Risk Level", name: "residualRiskLevel" },
        { key: "Hazard Status", name: "hazardStatus" },
        { key: "Fta Name Id", name: "ftaNameId" },
        { key: "User Field1", name: "userField1" },
        { key: "User Field2", name: "userField2" },
      )
    }
    else if (mName.test("PMMRA")) {
      moduleFieldData.push(
        { key: "Evident1", name: "Evident1" },
        { key: "Items", name: "Items" },
        { key: "Condition", name: "condition" },
        { key: "Failure", name: "failure" },
        { key: "Redesign", name: "redesign" },
        { key: "Acceptable", name: "acceptable" },
        { key: "Lubrication", name: "lubrication" },
        { key: "Task", name: "task" },
        { key: "Combination", name: "combination" },
        { key: "Rcm Notes", name: "rcmnotes" },
        { key: "Pm Task Id", name: "pmtaskid" },
        { key: "PM Task Type", name: "PMtasktype" },
        { key: "Task Interval Frequency", name: "taskintervalFrequency" },
        { key: "Task Interval Unit", name: "taskIntervalunit" },
        { key: "Scheduled Maintenance Task", name: "scheduledMaintenanceTask" },
        { key: "Task Interval", name: "taskInterval" },
        { key: "Task Description", name: "taskDescription" },
        { key: "Task Time ML1", name: "tasktimeML1" },
        { key: "Task Time ML2", name: "tasktimeML2" },
        { key: "Task Time ML3", name: "tasktimeML3" },
        { key: "Task Time ML4", name: "tasktimeML4" },
        { key: "Task Time ML5", name: "tasktimeML5" },
        { key: "Task Time ML6", name: "tasktimeML6" },
        { key: "Task Time ML7", name: "tasktimeML7" },
        { key: "Skill 1", name: "skill1" },
        { key: "Skill 1 Nos", name: "skill1nos" },
        { key: "Skill 1 Contribution", name: "skill1contribution" },
        { key: "Skill 2", name: "skill2" },
        { key: "Skill 2 Nos", name: "skill2nos" },
        { key: "Skill 2 Contribution", name: "skill2contribution" },
        { key: "Skill 3", name: "skill3" },
        { key: "Skill 3 Nos", name: "skill3nos" },
        { key: "Skill 3 Contribution", name: "skill3contribution" },
        { key: "Add Replace Spare 1", name: "addReplacespare1" },
        { key: "Add Replace Spare 1 Qty", name: "addReplacespare1qty" },
        { key: "Add Replace Spare 2", name: "addReplacespare2" },
        { key: "Add Replace Spare 2 Qty", name: "addReplacespare2qty" },
        { key: "Add Replace Spare 3", name: "addReplacespare3" },
        { key: "Add Replace Spare 3 Qty", name: "addReplacespare3qty" },
        { key: "Consumable 1", name: "Consumable1" },
        { key: "Consumable 1 Qty", name: "Consumable1qty" },
        { key: "Consumable 2", name: "Consumable2" },
        { key: "Consumable 2 Qty", name: "Consumable2qty" },
        { key: "Consumable 3", name: "Consumable3" },
        { key: "Consumable 3 Qty", name: "Consumable3qty" },
        { key: "Consumable 4", name: "Consumable4" },
        { key: "Consumable 4 Qty", name: "Consumable4qty" },
        { key: "Consumable 5", name: "Consumable5" },
        { key: "Consumable 5 Qty", name: "Consumable5qty" },
        { key: "User Field 1", name: "userfield1" },
        { key: "User Field 2", name: "userfield2" },
        { key: "User Field 3", name: "userfield3" },
        { key: "User Field 4", name: "userfield4" },
        { key: "User Field 5", name: "userfield5" }
      );
    } else if (mName.test("MTTR")) {
      moduleFieldData.push(
        { key: "Task Type", name: "TaskType" },
        { key: "Average Task Time(Hours)", name: "time" },
        { key: "No of Labours", name: "totalLabour" },
        { key: "Skills", name: "skill" },
        { key: "Tools", name: "tools" },
        { key: "Part no", name: "partNo" },
        { key: "Tool Type", name: "toolType" }
      );
    }
    if (existData.length == 0) {
      const libraryData = await libraries.create({
        projectId: data.projectId,
        companyId: data.companyId,
        moduleName: data.moduleName,
        moduleData: moduleFieldData,
      });

      res.status(200).json({
        message: "Module Created Successfully",
        libraryData,
      });
    } else {
      const libraryData = await libraries.findOne({
        moduleName: mName,
        projectId: data.projectId,
        companyId: data.companyId,
      });
      res.status(201).json({
        message: "Get Module Details Successfully",
        libraryData,
      });
    }
  } catch (err) {
    next(err);
  }
}
export async function getLibraryModulesData(req, res, next) {
  try {
    const data = req.body;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const libraryData = await libraries.findOne({
      moduleName: mName,
      projectId: data.projectId,
      companyId: data.companyId,
    });

    res.status(201).json({
      message: "Get Module Details Successfully",
      libraryData,
    });
  } catch (err) {
    next(err);
  }
}

export async function createSeprateLibrary(req, res, next) {
  try {
    const data = req.body;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const getData = await libraries.findOne({
      moduleName: mName,
      projectId: data.projectId,
      companyId: data.companyId,
    });
    const moduleData = getData.moduleData;
    for (const list of moduleData) {
      if (data.sourceId == list._id) {
        const fieldName = data.sourceValue.trim().toLowerCase();
        const existData = await separateLibrary.find({
          projectId: data.projectId,
          companyId: data.companyId,
          libraryId: getData.id,
          sourceId: list._id,
          sourceName: list.name,
          sourceValue: fieldName,
        });
        if (existData.length == 0) {
          const createData = await separateLibrary.create({
            projectId: data.projectId,
            companyId: data.companyId,
            libraryId: getData.id,
            sourceId: list._id,
            sourceName: list.name,
            sourceValue: fieldName,
            moduleName: data.moduleName,
          });
          res.status(201).json({
            message: "Seperate Library Created Successfully",
            createData,
          });
        } else {
          res.status(208).json({
            message: `This ${data.sourceValue} already exists in ${list.name}.`,
          });
        }
      }
    }
  } catch (err) {
    next(err);
  }
}
export async function updateSeprateLibraryField(req, res, next) {
  try {
    const data = req.body;
    const separateLibraryId = req.params.id;

    const fieldName = data.sourceValue.trim().toLowerCase();

    const updateData = await separateLibrary.findOne({
      _id: separateLibraryId,
    });

    const existData = await separateLibrary.find({
      projectId: data.projectId,
      companyId: data.companyId,
      libraryId: data.libraryId,
      sourceId: data.sourceId,
    });

    const exists = existData.some((item) => item.sourceValue === fieldName);

    if (exists) {
      res.status(208).json({
        message: `This ${fieldName} Already exist in ${data.sourceName}`,
        updateData,
      });
    } else {
      updateData.sourceValue = fieldName;
      await updateData.save();

      res.status(201).json({
        message: `This ${fieldName} updated in ${data.sourceName}`,
        updateData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getSeprateLibraryAllField(req, res, next) {
  try {
    const projId = req.query.projectId;
    const data = await separateLibrary.find({
      projectId: projId,
    });
    res.status(201).json({
      message: "Get All Seprate Library Values",
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function getSeprateLibraryField(req, res, next) {
  try {
    const id = req.params.id;
    const data = await separateLibrary.findOne({
      _id: id,
    });

    res.status(201).json({
      message: "Get Seprate Library Value",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export const deleteSeprateLibraryField = deleteOne(separateLibrary);

// connecetd Library Section

// export async function createConnectLibrary(req, res, next) {
//   try {
//     const data = req.body;
//     console.log("data.....", data)

//     const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
//     const libraryData = await libraries.findOne({
//       moduleName: mName,
//       projectId: data.projectId,
//       companyId: data.companyId,
//     });

//     libraryData.moduleData.map((list)=>{

//       if(data.sourceName === list.name){
//         res.status(400).json({
//           message: `${data.sourceName} field already created in seperate library `,
//         });
//       }
//     })
//     if (
//       data.destinationData.end.length == data.destinationData.valueEnd.length
//     ) {
//       const mappedData = [];

//       data.destinationData.end.forEach((endItem, index) => {
//         mappedData.push({
//           end: endItem,
//           valueEnd: data.destinationData.valueEnd[index],
//         });
//       });

//       mappedData.map(async (list) => {
//         const sourceValue = data.sourceValue.trim().toLowerCase();
//         const destinationValue = list.valueEnd.trim().toLowerCase();

//         const existData = await connectLibrary.find({
//           projectId: data.projectId,
//           companyId: data.companyId,
//           libraryId: libraryData._id,
//           sourceId: data.sourceId,
//           sourceValue: sourceValue,
//           destinationValue: destinationValue,
//         });

//         if (existData.length == 0) {
//           const createData = await connectLibrary.create({
//             projectId: data.projectId,
//             companyId: data.companyId,
//             libraryId: libraryData._id,
//             sourceId: data.sourceId,
//             sourceName: data.sourceName,
//             sourceValue: sourceValue,
//             destinationId: list.end.id,
//             destinationName: list.end.value,
//             destinationValue: destinationValue,
//           });

//           res.status(201).json({
//             message: "Create Connect Library Fields",
//             createData,
//           });
//         } else {
//           res.status(208).json({
//             message: `Already Exist to ${data.sourceName} field value is ${destinationValue}`,
//             existData,
//           });
//         }
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// }
export async function createConnectLibrary(req, res, next) {
  try {
    const data = req.body;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const libraryData = await libraries.findOne({
      moduleName: mName,
      projectId: data.projectId,
      companyId: data.companyId,
    });

    // const seperateData = await separateLibrary.find({
    //   libraryId: libraryData._id,
    //   moduleName: mName,
    // });

    // for (const list of seperateData) {
    //   console.log("list....",list)
    //   if (data.sourceName === list.sourceName) {
    //     return res.status(400).json({
    //       message: `${data.sourceName} field value already exist in separate library`,
    //     });
    //   }
    // }

    if (data.destinationData.end.length !== data.destinationData.valueEnd.length) {
      return res.status(400).json({
        message: "Mismatch in the length of destinationData arrays",
      });
    }

    const mappedData = data.destinationData.end.map((endItem, index) => {
      return {
        end: endItem,
        valueEnd: data.destinationData.valueEnd[index],
      };
    });

    const sourceValues = data?.sourceValue?.trim().toLowerCase();

    // seperate library creation while create source field value
    const existSeparateData = await separateLibrary.find({
      projectId: data.projectId,
      companyId: data.companyId,
      libraryId: libraryData._id,
      sourceId: data.sourceId,
      sourceName: data.sourceName,
      sourceValue: sourceValues,
    });
    if (existSeparateData.length === 0) {
      const createSeperateData = await separateLibrary.create({
        projectId: data.projectId,
        companyId: data.companyId,
        libraryId: libraryData._id,
        sourceId: data.sourceId,
        sourceName: data.sourceName,
        sourceValue: sourceValues,
        moduleName: data.moduleName,
      });
    }

    const promises = mappedData.map(async (list) => {
      const sourceValue = data?.sourceValue?.trim().toLowerCase();
      const destinationValue = list?.valueEnd?.trim().toLowerCase();
      const destinationModuleValue = data?.destinationModuleName?.trim();
      // check destinationa fields are already exist or not
      const existSeperateData = await separateLibrary.find({
        projectId: data.projectId,
        companyId: data.companyId,
        libraryId: libraryData._id,
        sourceName: list.end.value,
       sourceValue: destinationValue,
      });
      if(existSeperateData.length === 0){
        const createSeperateData = await separateLibrary.create({
          projectId: data.projectId,
          companyId: data.companyId,
          libraryId: libraryData._id,
          sourceId: data.sourceId,
          sourceName: data.sourceName,
          sourceValue: destinationValue,
        });
      }

      const existData = await connectLibrary.find({
        projectId: data.projectId,
        companyId: data.companyId,
        libraryId: libraryData._id,
        sourceId: data.sourceId,
        sourceValue: sourceValue,
        destinationValue: destinationValue,
      });
      if (existData.length === 0) {
          const createData = await connectLibrary.create({
            projectId: data.projectId,
            companyId: data.companyId,
            libraryId: libraryData._id,
            sourceId: data.sourceId,
            sourceName: data.sourceName,
            sourceValue: sourceValue,
            destinationModule: destinationModuleValue,
            destinationId: list.end.id,
            destinationName: list.end.value,
            destinationValue: destinationValue,
          });

          return {
            message: "Connect Library Fields Created Successfully",
            createData,
          };
        }
          else {
            return {
              message: `Already Exist to ${data.sourceName} field value is ${destinationValue}`,
              existData,
            };
          }
      } 
    );

    const results = await Promise.all(promises);

    results.forEach((result) => {
      if (result.message.startsWith("Already Exist")) {
        res.status(208).json(result);
      } else {
        res.status(201).json(result);
      }
    });
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
}

export async function updateConnectLibraryField(req, res, next) {
  try {
    const data = req.body;
    
    const mappData = data.destinationData;
    const end = mappData.end;
    const valueEnd = mappData.valueEnd;

    const combinedArray = end.map((item, index) => ({
      ...item,
      valueEnd: valueEnd[index],
    }));

    const updateResults = [];

    for (const list of combinedArray) {
      const getdata = await connectLibrary.find({
        projectId: data.projectId,
        sourceId: data.sourceId,
        destinationId: list.id,
      });
      if (getdata.length > 0) {
        getdata.map(async (gList) => {
          const editData = {
            destinationValue: list.valueEnd,
            sourceValue: data.sourceValue,
            destinationModule: data.destinationModuleName,
          };
          const updateData = await connectLibrary.findByIdAndUpdate(gList._id, editData, {
            runValidators: true,
            new: true,
          });

          updateResults.push(updateData);
        });
      } else {
        console.log("else.....")
        const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
        const libraryData = await libraries.findOne({
          moduleName: mName,
          projectId: data.projectId,
          companyId: data.companyId,
        });
        const existData = await connectLibrary.create({
          projectId: data.projectId,
          companyId: data.companyId,
          libraryId: libraryData._id,
          sourceId: data.sourceId,
          sourceName: data.sourceName,
          sourceValue: data.sourceValue,
          destinationId: list.id,
          destinationName: list.value,
          destinationValue: list.valueEnd,
          destinationModule: data.destinationModuleName,
        });
      }
    }

    res.status(201).json({
      message: "Connected Library Data Updated Successfully",
      updateData: updateResults,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConnectLibraryAllField(req, res, next) {
  try {
    const data = req.query;
    if (data.moduleName) {
      const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
      const existData = await libraries.findOne({
        moduleName: mName,
        projectId: data.projectId,
      });

      const libraryData = await connectLibrary
        .find({ projectId: data.projectId, libraryId: existData._id })
        .populate("libraryId");

      const groupedData = {};

      libraryData.forEach((item) => {
        const projectId = item.projectId;
        const sourceId = item.sourceId;
        const sourceValue = item.sourceValue;

        const key = `${sourceId}-${sourceValue}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            _id: item._id,
            projectId: projectId,
            companyId: item.companyId,
            libraryId: item.libraryId,
            sourceId: sourceId,
            sourceName: item.sourceName,
            sourceValue: sourceValue,
            destinationModuleName: item.destinationModule,
            destinationData: [],
          };
        }

        groupedData[key].destinationData.push({
          destinationId: item.destinationId,
          destinationName: item.destinationName,
          destinationValue: item.destinationValue,
          destinationModuleName: item.destinationModule,
        });
      });

      const getData = Object.values(groupedData);

      res.status(200).json({
        message: "Get All Data Successfully",
        getData,
      });
    } else {
      const libraryData = await connectLibrary.find({ projectId: data.projectId }).populate("libraryId");
      const groupedData = {};
      libraryData.forEach((item) => {
        const projectId = item.projectId;
        const sourceId = item.sourceId;
        const sourceValue = item.sourceValue;

        const key = `${sourceId}-${sourceValue}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            _id: item._id,
            projectId: projectId,
            companyId: item.companyId,
            libraryId: item.libraryId,
            sourceId: sourceId,
            sourceName: item.sourceName,
            sourceValue: sourceValue,
            destinationModuleName: item.destinationModule,
            destinationData: [],
          };
        }
        groupedData[key].destinationData.push({
          destinationId: item.destinationId,
          destinationName: item.destinationName,
          destinationValue: item.destinationValue,
          destinationModuleName: item.destinationModule,
        });
      });

      const getData = Object.values(groupedData);
      res.status(200).json({
        message: "Get All Data Successfully",
        getData,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getConnectLibraryField(req, res, next) {
  try {
    const data = req.query;

    const libraryData = await connectLibrary.findOne({
      sourceId: data.sourceId,
      projectId: data.projectId,
      destinationId: data.destinationId,
    });

    res.status(200).json({
      message: "Get Library Data Successfully",
      libraryData,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteConnectLibraryField(req, res, next) {
  try {
    const data = req.query;

    const deleteData = await connectLibrary.deleteMany({
      $and: [{ projectId: data.projectId }, { sourceId: data.sourceId }],
    });

    res.status(200).json({
      message: "Delete Data Successfully",
      deleteData,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSeparateModuleDataFieldValue(req, res, next) {
  try {
    const data = req.query;

    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");

    const getData = await separateLibrary.find({
      moduleName: mName,
      sourceId: data.fieldId,
    });
    res.status(200).json({
      message: "Get Data Successfully",
      getData,
    });
  } catch (err) {
    console.log("Error......", err);
    next(err);
  }
}

export async function getSeparateDestinationData(req, res, next) {
  try {
    const data = req.query;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const getData = await separateLibrary.find({
      moduleName: mName,
      sourceId: data.fieldId,
    });

    res.status(200).json({
      message: "Get Data Successfully",
      getData,
    });
  } catch (err) {
    console.log("Error.....", err);
    next(err);
  }
}
export async function getAllLibraryDataValues(req, res, next) {
  try {
    const projId = req.query.projectId;
    const data = await separateLibrary.find({
      projectId: projId,
    });
    res.status(201).json({
      message: "Get All Seprate Library Values",
      data,
    });
  } catch (err) {
    next(err);
  }
}
export async function getAllConnectedLibraryData(req, res, next) {
  try {
    const data = req.query;
    const mName = new RegExp(["^", data.moduleName, "$"].join(""), "i");
    const existData = await libraries.findOne({
      moduleName: mName,
      projectId: data.projectId,
    });
    const libraryData = await connectLibrary
      .find({
        projectId: data.projectId,
        libraryId: existData._id,
        sourceName: data.sourceName,
        sourceValue: data.sourceValue,
      })
      .populate("libraryId");
    res.status(200).json({
      message: "Get All Connected Library Values",
      libraryData,
    });
  } catch (err) {
    next(err);
  }
}
