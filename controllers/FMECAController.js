import FMECA from "../models/FMECAModel.js";
import { deleteOne } from "./baseController.js";

export async function createFMECA(req, res, next) {
  try {
    const data = req.body;

   
    const FailureModeRadio = data?.Alldata;
   
    const FailureModeRadioTrue = data?.Alldata ? true : false;
    if (FailureModeRadioTrue === true) {
      const finalValue = [];
      const finalValueForEndEffectBeta = [];
      finalValue.push(parseFloat(data.failureModeRatioAlpha));
      finalValueForEndEffectBeta.push(parseFloat(data.endEffectRatioBeta));
      FailureModeRadio.map((list) => {
        finalValue.push(parseFloat(list.failureModeRatioAlpha));
        finalValueForEndEffectBeta.push(parseFloat(list.endEffectRatioBeta));
      });
      const sumofFailureModeRadio = finalValue.reduce((accumulator, currentvalue) => accumulator + currentvalue);
      const sumofEndEffectRatioBeta = finalValueForEndEffectBeta.reduce((accumulator, currentvalue) => accumulator + currentvalue);
  
      const lastValue = Promise.resolve(sumofFailureModeRadio);
      if (sumofFailureModeRadio > 1) {
      res.status(400).json({
        message: "Failure Mode Radio Alpha Must be Equal to One",
      });
      }else if (sumofEndEffectRatioBeta > 1) {
        res.status(400).json({
          message: "End Effect Ratio Beta Must be Equal to One",
        });
      }else if (sumofFailureModeRadio < 1 || sumofFailureModeRadio === 1) {
      const existData = await FMECA.find({
        projectId: data.projectId, productId: data.productId
      });
    
      
      const createData = await FMECA.create({
        fmecaId: existData.length + 1,
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
        message: "FMECA Created Successfully",
        data: {
          createData,
        },
      });
      }
    }
  } catch (error) {
    next(error);
  }
}
export async function updateFMECA(req, res, next) {
  try {
    const data = req.body;
    
 
    const FailureModeRadio = data?.Alldata;
    
    const FailureModeRadioTrue = data.Alldata ? true : false;
 
    const currentFailureModeRadioAlphaValue = data.failureModeRatioAlpha;

    if (FailureModeRadioTrue) {
      console.log("if condition")
      if (data.failureModeRatioAlpha <= 1) {
        const finalValue = [];
        FailureModeRadio?.map((list) => {
          finalValue.push(parseFloat(list.failureModeRatioAlpha));
        });
        finalValue.push(parseFloat(currentFailureModeRadioAlphaValue));

        const FailureRadioModeAdditionValue = finalValue.reduce(
          (accumulator, currentvalue) => accumulator + currentvalue
        );
        const degrementValue = await FMECA.findOne({ _id: data.fmecaId });
        const totalValue = [];
        totalValue.push(FailureRadioModeAdditionValue);
        totalValue.push(parseFloat(degrementValue.failureModeRatioAlpha));

        const sumofFailureModeRadio = totalValue.reduce((total, value) => total - value);

        if (sumofFailureModeRadio > 1) {
          res.status(400).json({
            message: "Failure Mode Radio Alpha Must be Equal to One",
          });
        } else if (sumofFailureModeRadio < 1 || sumofFailureModeRadio === 1) {
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
          console.log("editData123....", editData);
          console.log("data.fmecaId....", data.fmecaId);
          const editDetail = await FMECA.findByIdAndUpdate(data.fmecaId, editData, {
            new: true,
            runValidators: true,
          });
          // console.log("editDetail....", editDetail)
          res.status(200).json({
            message: "FMECA Updated Successfully",
            editDetail,
          });
        }
        // const sumofFailureModeRadio = finalValue.reduce((accumulator, currentvalue) => accumulator + currentvalue);
        // const lastValue = Promise.resolve(sumofFailureModeRadio);
        // if (sumofFailureModeRadio > 1) {

        // } else if (sumofFailureModeRadio < 1 || sumofFailureModeRadio === 1) {
      } else {
        res.status(204).json({
          message: "Failure Mode Radio Alpha Must be Equal to One",
        });
      }
    }else{
      console.log("elseeeeeee")
    }
  } catch (error) {
    console.log("error....", error)
    next(error);
  }
}

export async function getAllFMECA(req, res, next) {
  try {
    const sparePartsData = await FMECA.find()

      .populate("companyId")
      .populate("productId")
      .populate("projectId");

    res.status(201).json({
      message: "Get All FMECA Details Successfully",
      data: sparePartsData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFMECA(req, res, next) {
  try {
    const data = req.query;
    

    const fmecaData = await FMECA.find({ projectId: data.projectId, productId: data.productId })
      .populate("companyId")
      .populate("productId")
      .populate("projectId");
    

    res.status(200).json({
      message: "Get FMECA Details Successfully",
      data: fmecaData,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBulkUploadData(req, res, next) {
  try {
    const data = req.body;
    const bulkData = data.postData;

    

    // 1️⃣ Existing DB sums
    const existingData = await FMECA.find(
      { projectId: data.projectId, productId: data.productId },
      { failureModeRatioAlpha: 1, endEffectRatioBeta: 1 }
    );

    const existingFailureModeSum = existingData.reduce(
      (sum, item) => sum + (Number(item.failureModeRatioAlpha) || 0),
      0
    );

    const existingEndEffectSum = existingData.reduce(
      (sum, item) => sum + (Number(item.endEffectRatioBeta) || 0),
      0
    );

    // 2️⃣ Bulk sums
    const bulkFailureModeSum = bulkData.reduce(
      (sum, item) => sum + (Number(item.failureModeRatioAlpha) || 0),
      0
    );

    const bulkEndEffectSum = bulkData.reduce(
      (sum, item) => sum + (Number(item.endEffectRatioBeta) || 0),
      0
    );
    console.log("existingFailureModeSum......",existingFailureModeSum);
    console.log("bulkFailureModeSum.......",bulkFailureModeSum)

    // 3️⃣ Validate totals
    if (existingFailureModeSum + bulkFailureModeSum > 1) {
      return res.status(400).json({
        message: "Failure Mode Ratio Alpha sum must not exceed 1",
      });
    }
    console.log("existingEndEffectSum......",existingEndEffectSum);
    console.log("bulkEndEffectSum.....",bulkEndEffectSum)

    if (existingEndEffectSum + bulkEndEffectSum > 1) {
      return res.status(400).json({
        message: "End Effect Ratio Beta sum must not exceed 1",
      });
    }

    // 4️⃣ Generate FMECA IDs
    const existingCount = await FMECA.countDocuments({
      projectId: data.projectId,
      productId: data.productId,
    });

    let nextFmecaId = existingCount + 1;
    console.log("nextFmecaId.....",nextFmecaId)

    // 5️⃣ Prepare docs
   const createData = bulkData.map((item) => ({
      fmecaId: nextFmecaId++,
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
       operatingPhase: item.operatingPhase,
        function: item.function,
        failureMode: item.failureMode,
        // searchFM: item.searchFM,
        cause: item.cause,
        failureModeRatioAlpha: item.failureModeRatioAlpha,
        detectableMeansDuringOperation: item.detectableMeansDuringOperation,
        detectableMeansToMaintainer: item.detectableMeansToMaintainer,
        BuiltInTest: item.BuiltInTest,
        subSystemEffect: item.subSystemEffect,
        systemEffect: item.systemEffect,
        endEffect: item.endEffect,
        endEffectRatioBeta: item.endEffectRatioBeta,
        safetyImpact: item.safetyImpact,
        referenceHazardId: item.referenceHazardId,
        realibilityImpact: item.realibilityImpact,
        serviceDisruptionTime: item.serviceDisruptionTime,
        frequency: item.frequency,
        severity: item.severity,
        riskIndex: item.riskIndex,
        designControl: item.designControl,
        maintenanceControl: item.maintenanceControl,
        exportConstraints: item.exportConstraints,
        immediteActionDuringOperationalPhase: item.immediteActionDuringOperationalPhase,
        immediteActionDuringNonOperationalPhase: item.immediteActionDuringNonOperationalPhase,
        userField1: item.userField1,
        userField2: item.userField2,
        userField3: item.userField3,
        userField4: item.userField4,
        userField5: item.userField5,
        userField6: item.userField6,
        userField7: item.userField7,
        userField8: item.userField8,
        userField9: item.userField9,
        userField10: item.userField10,
    }));
    console.log("docs...2....",createData)

    // 6️⃣ Insert
    await FMECA.insertMany(createData);

      res.status(201).json({
        message: "Bulk FMECA uploaded successfully",
        data: {
          createData,
        },
      });

  
  } catch (error) {
    console.log("error.....",error)
    next(error);
  }
}


export const deleteFMECA = deleteOne(FMECA);
