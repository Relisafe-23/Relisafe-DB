import productBreakdownStructure from "../models/productBreakdownStructureModel.js";
import product from "../models/productModel.js";
import mttrPrediction from "../models/mttrPredictionModel.js";
import productTreeStructure from "../models/productTreeStructure.js";
import { ACTIVE_TREE } from "../constants/productStatus.js";

export async function createProductBreakdownStructure(req, res, next) {
  try {
    const data = req.body;
    console.log("data.......",data)

    const createProductBreakdownStructure = await productBreakdownStructure.create({
      productName: data.productName,
      category: data.category,
      reference: data.reference,
      partType: data.partType,
      partNumber: data.partNumber,
      quantity: data.quantity,
      environment: data.environment,
      temperature: data.temperature,
      projectId: data.projectId,
      companyId: data.companyId,
    });

    const treeIndexCount = await productTreeStructure.find({
      projectId: data.projectId,
    });

    let parentProduct = [];
    treeIndexCount.forEach(list => {
      if(list.treeStructure.status ==="active"){
        parentProduct.push(list)
      }
    });
    const treeIndex = parentProduct.length;
  

    const createData = await product.create({
      projectId: data.projectId,
      companyId: data.companyId,
      productName: data.productName,
      category: data.category,
      reference: data.reference,
      partType: data.partType,
      partNumber: data.partNumber,
      quantity: data.quantity,
      environment: data.environment,
      temperature: data.temperature,
      status: ACTIVE_TREE,
    });

    const productSubData = {
      projectId: data.projectId,
      companyId: data.companyId,
      productId: createData.id,
      parentId: createData._id,
      productName: data.productName,
      reference: data.reference,
      partType: data.partType,
      partNumber: data.partNumber,
      quantity: data.quantity,
      environment: data.environment,
      temperature: data.temperature,
    };


    const parentId = await productTreeStructure.create({
      projectId: data.projectId,
      companyId: data.companyId,
      productId: createData._id,
      // treeStructure: createNode,
    });

    // create parent data in mttr table 
    const createMttrData = await mttrPrediction.create({
      companyId: data.companyId,
      projectId: data.projectId,
      productId: createData._id,
    });

    const createNode = {
      id: createData._id,
      indexCount: treeIndex + 1,
      type: "Product",
      productName: data.productName,
      category: data.category,
      reference: data.reference,
      partType: data.partType,
      partNumber: data.partNumber,
      quantity: data.quantity,
      environment: data.environment,
      temperature: data.temperature,
      status: ACTIVE_TREE,
      parentId: parentId.id,
      fr: "",
      mttr: "",
      mct: "",
      mlh: "",
      children: [],
    };

    const updatetreeStructure = {
      treeStructure: createNode,
    };

    const parentsId = await productTreeStructure.findByIdAndUpdate(parentId.id, updatetreeStructure, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: "Product Created Successfuly",
      data: {
        createNode,
        parentId,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductBreakdownStructure(req, res, next) {
  try {
    const data = req.body;
    
    const editData = {
      productName: data.productName,
      category: data.category,
      reference: data.reference,
      partType: data.partType,
      partNumber: data.partNumber,
      quantity: data.quantity,
      environment: data.environment,
      temperature: data.temperature,
    };

    const updateProductBreakdownStructure = await productBreakdownStructure.findByIdAndUpdate(
      data.productBreakdownStructureId,
      editData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      message: "Product Breakdown Structure Update Successfuly",
      data: {
        updateProductBreakdownStructure,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductBreakdownStructure(req, res, next) {
  try {
    const projctId = req.params.id;

    const data = await productBreakdownStructure
      .find({
        projectId: projctId,
        // _id: data.productBreakdownStructureId,
      })
      .populate("projectId")
      .populate("companyId")
      .populate("assemblyId")
      .populate("electronicalId")
      .populate("mechanicalId");

    res.status(201).json({
      message: "Get Product Breakdown Structure Details",
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getAllproductBreakdownStructure(req, res, next) {
  try {
    const getAllData = await productBreakdownStructure
      .find()
      .populate("projectId")
      .populate("companyId")
      .populate("assemblyId")
      .populate("electronicalId")
      .populate("mechanicalId");

    res.status(201).json({
      message: "Get All Product Breakdown Structure Details",
      data: {
        getAllData,
      },
    });
  } catch (error) {
    next(error);
  }
}

// export async function deleteproductBreakdownStructure(req, res, next) {
//   try {
//     const id = req.params.id;

//     const data = await productBreakdownStructure.findOne({ projectId: id });

//     const editedData = {
//       status: "Inactive",
//     };
//     const deleteData = await productBreakdownStructure.findByIdAndUpdate(data._id, editedData, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(201).json({
//       message: "Project PBS Deleted Successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function deleteproductBreakdownStructure(req, res, next) {
  try {
    const id = req.params.id;

    const data = await productBreakdownStructure.findOne({ projectId: id });

    if (data) {
      const deleteData = await productBreakdownStructure.findByIdAndDelete({
        _id: data._id,
      });
      res.status(201).json({
        message: "Product Breakdown Structure Deleted Successfully",
      });
    } else {
      return next(new AppError(404, "fail", "No document found with that id"), req, res, next);
    }
  } catch (error) {
    next(error);
  }
}
