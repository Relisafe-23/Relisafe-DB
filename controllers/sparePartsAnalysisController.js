import productTreeStructure from "../models/productTreeStructure.js";
import sparePartsAnalysisList from "../models/sparePartsAnalysisModel.js";
import { deleteOne } from "./baseController.js";
import Project from "../models/projectModel.js";

export async function createSparePartsAnalysis(req, res, next) {
  try {
    const data = req.body;

    const exist = await sparePartsAnalysisList.find({
      productId: data.productId,
      projectId: data.projectId,
      companyId: data.companyId,
    });

    const createData = await sparePartsAnalysisList.create({
      spare: data.spare,
      recommendedSpare: data.recommendedSpare,
      warrantySpare: data.warrantySpare,
      deliveryTimeDays: data.deliveryTimeDays,
      afterSerialProductionPrice1: data.afterSerialProductionPrice1,
      price1MOQ: data.price1MOQ,
      afterSerialProductionPrice2: data.afterSerialProductionPrice2,
      price2MOQ: data.price2MOQ,
      afterSerialProductionPrice3: data.afterSerialProductionPrice3,
      price3MOQ: data.price3MOQ,
      annualPriceEscalationPercentage: data.annualPriceEscalationPercentage,
      lccPriceValidity: data.lccPriceValidity,
      calculatedSpareQuantity: data.calculatedSpareQuantity,
      recommendedSpareQuantity: data.recommendedSpareQuantity,
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
    });
    res.status(201).json({
      message: "Spare Parts Analysis Created Successfully",
      data: {
        createData,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSparePartsAnalysis(req, res, next) {
  try {
    const data = req.body;

    const editData = {
      spare: data.spare,
      recommendedSpare: data.recommendedSpare,
      warrantySpare: data.warrantySpare,
      deliveryTimeDays: data.deliveryTimeDays,
      afterSerialProductionPrice1: data.afterSerialProductionPrice1,
      price1MOQ: data.price1MOQ,
      afterSerialProductionPrice2: data.afterSerialProductionPrice2,
      price2MOQ: data.price2MOQ,
      afterSerialProductionPrice3: data.afterSerialProductionPrice3,
      price3MOQ: data.price3MOQ,
      annualPriceEscalationPercentage: data.annualPriceEscalationPercentage,
      lccPriceValidity: data.lccPriceValidity,
      calculatedSpareQuantity: data.calculatedSpareQuantity,
      recommendedSpareQuantity: data.recommendedSpareQuantity,
      projectId: data.projectId,
      companyId: data.companyId,
      productId: data.productId,
    };

    const editDetail = await sparePartsAnalysisList.findByIdAndUpdate(
      data.spareId,
      editData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      message: "Spare Parts Analysis Updated Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllSparePartsAnalysis(req, res, next) {
  try {
    const data = req.query;

    const sparePartsData = await sparePartsAnalysisList
      .findOne({
        projectId: data.projectId,
        productId: data.productId,
        companyId: data.companyId,
      })
      .populate("projectId")
      .populate("companyId")
      .populate("productId");

    const productTS = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const spareTreeStructure = productTS?.treeStructure;

    let spareTreeData = [];
    let productFrp = 0;

    findSingleProduct(spareTreeStructure);

    async function findSingleProduct(node) {
      if (node.status === "active") {
        spareTreeData.push(node);
      }

      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          findSparePartsSingleProduct(node.children[i]);
        }
      }

      async function findSparePartsSingleProduct(node) {
        if (node.status === "active") {
          spareTreeData.push(node);
        }
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            findSparePartsSingleProduct(node.children[i]);
          }
        }
      }
    }

    for (let i = 0; i < spareTreeData.length; i++) {
      findSpareProduct(spareTreeData[i]);
    }

    async function findSpareProduct(node) {
      if (node.id == data.productId && node.fr) {
        productFrp = node.fr;
      }
    }

    const projectDetails = await Project.findById(data.projectId);
    const productTreeStructureFRvalue = productFrp / 1e6;

    const missionTime = sparePartsData ? sparePartsData.deliveryTimeDays : 0;

    const nonShortProbability = projectDetails.nonShortProbability;

    const e = Math.E;

    const mulitpleofvalue = productTreeStructureFRvalue * missionTime;

    // const value1 = Math.pow(e, -mulitpleofvalue);
    const value1 = Math.pow(e, -mulitpleofvalue);

    const valuesofFinal = [];
    let finalValue;
    let sum = 0;

    for (let i = 0; i <= 50; i++) {
      function factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let j = 2; j <= n; j++) {
          result *= j;
        }
        return result;
      }

      const lamdavalue = Math.pow(mulitpleofvalue, i);
      const factorialvalue = factorial(i);

      const value2 = lamdavalue / factorialvalue;

      finalValue = value1 * value2;

      sum += finalValue;

      if (sum >= nonShortProbability) {
        valuesofFinal.push(i);
        break;
      }
    }

    const CalculatedSpareQuantity =
      valuesofFinal.length > 0 ? valuesofFinal[0] : 0;

    res.status(201).json({
      message: "Get All Spare Parts Analysis Details",
      data: sparePartsData,
      CalculatedSpareQuantity,
    });
  } catch (error) {
    console.error("Error in getAllSparePartsAnalysis:", error);
    next(error);
  }
}

export async function getSparePartsAnalysis(req, res, next) {
  try {
    const id = req.params.id;

    const sparePartsData = await sparePartsAnalysisList
      .findOne({ _id: id })
      .populate("projectId")
      .populate("companyId")
      .populate("productId");

    res.status(200).json({
      message: "Gel Spare Parts Analysis Details",
      data: sparePartsData,
    });
  } catch (error) {
    next(error);
  }
}

export const deleteSparePartsAnalysis = deleteOne(sparePartsAnalysisList);
