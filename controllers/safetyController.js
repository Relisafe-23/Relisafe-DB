import safety from "../models/safetyModel.js";
import { deleteOne } from "./baseController.js";

export async function createSafety(req, res, next) {
  try {
    const data = req.body;

    const createData = await safety.create({
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
      operatingPhase: data.operatingPhase,
      function: data.function,
      failureMode: data.failureMode,
      // searchFM: data.searchFM,
      cause: data.cause,
      failureModeRatioAlpha: data.failureModeRatioAlpha,
      detectableMeansDuringOperation: data.detectableMeansDuringOperation,
      detectableMeansToMaintainer: data.detectableMeansToMaintainer,
      BuiltInTest: data.BuiltInTest,
      subSystemEffect: data.subSystemEffect,
      systemEffect: data.systemEffect,
      endEffect: data.endEffect,
      endEffectRatioBeta: data.endEffectRatioBeta,
      safetyImpact: data.safetyImpact,
      referenceHazardId: data.referenceHazardId,
      realibilityImpact: data.realibilityImpact,
      serviceDisruptionTime: data.serviceDisruptionTime,
      frequency: data.frequency,
      severity: data.severity,
      riskIndex: data.riskIndex,
      designControl: data.designControl,
      maintenanceControl: data.maintenanceControl,
      exportConstraints: data.exportConstraints,
      immediteActionDuringOperationalPhase: data.immediteActionDuringOperationalPhase,
      immediteActionDuringNonOperationalPhase: data.immediteActionDuringNonOperationalPhase,
      userField1: data.userField1,
      userField2: data.userField2,
      userField3: data.userField3,
      userField4: data.userField4,
      userField5: data.userField5,
      userField6: data.userField6,
      userField7: data.userField7,
      userField8: data.userField8,
      userField9: data.userField9,
      userField10: data.userField10,
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
      operatingPhase: data.operatingPhase,
      function: data.function,
      failureMode: data.failureMode,
      // searchFM: data.searchFM,
      failureModeRatioAlpha: data.failureModeRatioAlpha,
      cause: data.cause,
      failureModeRatioAlpha: data.failureModeRatioAlpha,
      detectableMeansDuringOperation: data.detectableMeansDuringOperation,
      detectableMeansToMaintainer: data.detectableMeansToMaintainer,
      BuiltInTest: data.BuiltInTest,
      subSystemEffect: data.subSystemEffect,
      systemEffect: data.systemEffect,
      endEffect: data.endEffect,
      endEffectRatioBeta: data.endEffectRatioBeta,
      safetyImpact: data.safetyImpact,
      referenceHazardId: data.referenceHazardId,
      realibilityImpact: data.realibilityImpact,
      serviceDisruptionTime: data.serviceDisruptionTime,
      frequency: data.frequency,
      severity: data.severity,
      riskIndex: data.riskIndex,
      designControl: data.designControl,
      maintenanceControl: data.maintenanceControl,
      exportConstraints: data.exportConstraints,
      immediteActionDuringOperationalPhase: data.immediteActionDuringOperationalPhase,
      immediteActionDuringNonOperationalPhase: data.immediteActionDuringNonOperationalPhase,
      immediteActionDuringOperationalPhase: data.immediteActionDuringOperationalPhase,
      userField1: data.userField1,
      userField2: data.userField2,
      userField3: data.userField3,
      userField4: data.userField4,
      userField5: data.userField5,
      userField6: data.userField6,
      userField7: data.userField7,
      userField8: data.userField8,
      userField9: data.userField9,
      userField10: data.userField10,
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
