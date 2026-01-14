import safety from "../models/safetyModel.js";
import { deleteOne } from "./baseController.js";

export async function createSafety(req, res, next) {
  try {
    const data = req.body;
    console.log(data, "data safety")
    const createData = await safety.create({
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
      hazard: data.hazard,
      modeOfOperation: data.modeOfOperation,
      hazardCause: data.hazardCause,
      effectOfHazard: data.effectOfHazard,
      hazardClasification: data.hazardClasification,
      designAssuranceLevel: data.designAssuranceLevel,
      meansOfDetection: data.meansOfDetection,
      crewResponse: data.crewResponse,
      uniqueHazardIdentifier: data.uniqueHazardIdentifier,
      initialSeverity: data.initialSeverity,
      initialLikelihood: data.initialLikelihood,
      initialRiskLevel: data.initialRiskLevel,
      designMitigation: data.designMitigation,
      designMitigatonResbiity: data.designMitigatonResbiity,
      designMitigtonEvidence: data.designMitigtonEvidence,
      opernalMaintanMitigation: data.opernalMaintanMitigation,
      opernalMitigatonResbility: data.opernalMitigatonResbility,
      operatnalMitigationEvidence: data.operatnalMitigationEvidence,
      residualSeverity: data.residualSeverity,
      residualLikelihood: data.residualLikelihood,
      residualRiskLevel: data.residualRiskLevel,
      hazardStatus: data.hazardStatus,
      ftaNameId: data.ftaNameId,
      userField1: data.userField1,
      userField2: data.userField2,
    });
    res.status(201).json({
      message: "Safety Created Successfully",
      data: {
        createData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSafety(req, res, next) {
  try {
    const data = req.body;

    const editData = {
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
      // hazard: data.hazard,
      modeOfOperation: data.modeOfOperation,
      hazardCause: data.hazardCause,
      effectOfHazard: data.effectOfHazard,
      hazardClasification: data.hazardClasification,
      designAssuranceLevel: data.designAssuranceLevel,
      meansOfDetection: data.meansOfDetection,
      crewResponse: data.crewResponse,
      uniqueHazardIdentifier: data.uniqueHazardIdentifier,
      initialSeverity: data.initialSeverity,
      initialLikelihood: data.initialLikelihood,
      initialRiskLevel: data.initialRiskLevel,
      designMitigation: data.designMitigation,
      designMitigatonResbiity: data.designMitigatonResbiity,
      designMitigtonEvidence: data.designMitigtonEvidence,
      opernalMaintanMitigation: data.opernalMaintanMitigation,
      opernalMitigatonResbility: data.opernalMitigatonResbility,
      operatnalMitigationEvidence: data.operatnalMitigationEvidence,
      residualSeverity: data.residualSeverity,
      residualLikelihood: data.residualLikelihood,
      residualRiskLevel: data.residualRiskLevel,
      hazardStatus: data.hazardStatus,
      ftaNameId: data.ftaNameId,
      userField1: data.userField1,
      userField2: data.userField2,
    };

    const editDetail = await safety.findByIdAndUpdate(data.safetyId, editData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Safety Updated Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllSafety(req, res, next) {
  try {
    const sparePartsData = await safety
      .find()

      .populate("companyId")
      .populate("productId")
      .populate("projectId");

    res.status(201).json({
      message: "Get All Safety Details Successfully",
      data: sparePartsData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSafety(req, res, next) {
  try {
    const data = req.query;

    const safetyData = await safety
      .find({ projectId: data.projectId, productId: data.productId })
      .populate("companyId")
      .populate("productId")
      .populate("projectId");

    res.status(200).json({
      message: "Get Safety Details Successfully",
      data: safetyData,
    });
  } catch (error) {
    next(error);
  }
}

export const deleteSafety = deleteOne(safety);
