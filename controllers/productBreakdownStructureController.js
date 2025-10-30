import productBreakdownStructure from "../models/productBreakdownStructureModel.js";
import product from "../models/productModel.js";
import mttrPrediction from "../models/mttrPredictionModel.js";
import productTreeStructure from "../models/productTreeStructure.js";
import { ACTIVE_TREE } from "../constants/productStatus.js";
import mongoose from "mongoose";
import { IdentityPoolClient } from "google-auth-library";

export async function createProductBreakdownStructure(req, res, next) {
  try {
    const data = req.body;
    const createProductBreakdownStructure =
      await productBreakdownStructure.create({
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
    treeIndexCount.forEach((list) => {
      if (list.treeStructure.status === "active") {
        parentProduct.push(list);
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

    const parentsId = await productTreeStructure.findByIdAndUpdate(
      parentId.id,
      updatetreeStructure,
      {
        new: true,
        runValidators: true,
      }
    );

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

    const updateProductBreakdownStructure =
      await productBreakdownStructure.findByIdAndUpdate(
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
export async function   getAllproductBreakdownStructure(req, res, next) {
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
      return next(
        new AppError(404, "fail", "No document found with that id"),
        req,
        res,
        next
      );
    }
  } catch (error) {
    next(error);
  }
}

export async function createPbsRecordFromImportFile(req, res, next) {
  try {
    const { rowData, projectId, companyId } = req.body;
    
    if (!rowData || !Array.isArray(rowData)) {
      return res.status(400).json({
        error: "rowData is required and must be an array",
      });
    }

    // Sort data numerically (1, 1.1, 1.2, 2, etc.)
    const sortedRowData = [...rowData].sort((a, b) => {
      const aParts = a.indexCount.split('.').map(Number);
      const bParts = b.indexCount.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return aVal - bVal;
      }
      return 0;
    });

    const nodesMap = new Map();

    // Step 1: Create all products
    for (const productData of sortedRowData) {
      const createdProduct = await product.create({
        projectId,
        companyId,
        productName: productData.productName,
        category: productData.category,
        reference: productData.reference,
        partType: productData.partType,
        partNumber: productData.partNumber,
        quantity: productData.quantity,
        environment: productData.environment,
        temperature: productData.temperature,
        status: ACTIVE_TREE,
      });

      const node = {
        id: createdProduct._id,
        indexCount: String(productData.indexCount),
        type: "Product",
        productName: productData.productName,
        category: productData.category,
        reference: productData.reference,
        partType: productData.partType,
        partNumber: productData.partNumber,
        quantity: productData.quantity,
        environment: productData.environment,
        temperature: productData.temperature,
        status: ACTIVE_TREE,
        fr: productData.fr || 0,
        mttr: productData.mttr || 0,
        mct: productData.mct || 0,
        mlh: productData.mlh || 0,
        parentId: null,
        productId: null,
        children: [],
      };

      nodesMap.set(node.indexCount, node);
    }

    // Step 2: Build hierarchy (only where there is a parent)
    for (const [indexCount, node] of nodesMap) {
      const level = indexCount.split('.').length;
      if (level > 1) {
        const parentIndexCount = indexCount.split('.').slice(0, -1).join('.');
        const parentNode = nodesMap.get(parentIndexCount);
        if (parentNode) {
          node.productId = parentNode.id;
          parentNode.children.push(node);
        }
      }
    }

    // ✅ Step 3: Gather all root-level nodes (1, 2, 3, etc.)
    const rootNodes = Array.from(nodesMap.values()).filter(
      node => node.indexCount.split('.').length === 1
    );

    if (rootNodes.length === 0) {
      return res.status(400).json({ error: "No top-level products found" });
    }

    // Step 4: Find or create tree structure
    let treeStructure = await productTreeStructure.findOne({ projectId, companyId });
    const treeStructureId = treeStructure ? treeStructure._id.toString() : null;

    // Step 5: Build final structure recursively
    function buildFinalStructure(node, parentTreeId) {
      const finalNode = { ...node };
      finalNode.parentId = parentTreeId;
      if (finalNode.children && finalNode.children.length > 0) {
        finalNode.children = finalNode.children.map(child =>
          buildFinalStructure(child, parentTreeId)
        );
      }
      return finalNode;
    }

    // ✅ Step 6: Create combined structure (keep same format as before)
    const finalStructure = {
      id: treeStructureId,
      type: "RootGroup",
      children: rootNodes.map(root => buildFinalStructure(root, treeStructureId)),
    };

    // Step 7: Save to DB
    if (treeStructure) {
      await productTreeStructure.findByIdAndUpdate(
        treeStructure._id,
        {
          $set: {
            treeStructure: finalStructure,
            productId: null,
          },
        },
        { new: true, runValidators: true }
      );
    } else {
      const newStructure = await productTreeStructure.create({
        projectId,
        companyId,
        productId: null,
        treeStructure: finalStructure,
      });
      const newTreeId = newStructure._id.toString();
      const rebuiltStructure = {
        ...finalStructure,
        id: newTreeId,
      };
      await productTreeStructure.findByIdAndUpdate(
        newTreeId,
        { $set: { treeStructure: rebuiltStructure } },
        { new: true, runValidators: true }
      );
    }

    res.status(201).json({
      message: "Products imported successfully with separate top-level roots",
    });
  } catch (error) {
    console.error("Error in createPbsRecordFromImportFile:", error);
    next(error);
  }
}


