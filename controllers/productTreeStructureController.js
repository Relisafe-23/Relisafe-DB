import productTreeStructure from "../models/productTreeStructure.js";
import { deleteOne, getAll } from "./baseController.js";

export async function getProductTreeStructure(req, res, next) {
  try {
    const data = req.body;

    const projectData = await productTreeStructure
      .find({ _id: data.treeId })
      .populate("projectId")
      .populate("companyId");

    res.status(201).json({
      message: "Get Project Tree Structure",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllProductDetails(req, res, next) {
  try {
    const data = req.query;

    const productData = await productTreeStructure
      .find({ projectId: data.projectId })
      .populate("projectId")
      .populate("companyId");

    res.status(201).json({
      message: "Get Project Tree Structure Details Successfully",
      data: productData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllProductTreeStructure(req, res, next) {
  try {
    const projectData = await productTreeStructure.find().populate("projectId").populate("companyId");

    res.status(201).json({
      message: "Get All Project Tree Structure",
      data: projectData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductList(req, res, next) {
  try {
    const data = req.query;
    const treeStructure = await productTreeStructure
      .find({ projectId: data.projectId })
      .populate("projectId")
      .populate("companyId");
    const allProductData = [];
    treeStructure.map((list) => {
      const addParentProduct = list.treeStructure;
      if (addParentProduct.status == "active") {
        allProductData.push(addParentProduct);
      }
      const childNode = addParentProduct.children;
      getNodeTreeProduct(childNode);
      async function getNodeTreeProduct(childNode) {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      }
    });
    res.status(201).json({
      message: "Get Product List Tree Structure",
      data: allProductData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTreeProductList(req, res, next) {
  try {
    const data = req.query;
    const treeStructure = await productTreeStructure
      .find({ projectId: data.projectId })
      .populate("projectId")
      .populate("companyId");
    const allProductData = [];
    treeStructure.map((list) => {
      const addParentProduct = list.treeStructure;
      if (addParentProduct.status == "active") {
        allProductData.push(addParentProduct);
      }

      const childNode = addParentProduct.children;
      getNodeTreeProduct(childNode);
      async function getNodeTreeProduct(childNode) {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      }
    });
    let productData = "";
    var result = allProductData.filter(function (e, i) {
      if (allProductData[i].id == data.treeStructureId) {
        productData = e;
      }
    });

    res.status(201).json({
      message: "Get Product List Tree Structure",
      data: productData,
    });
  } catch (error) {
    next(error);
  }
}

export const deleteproductTreeStructure = deleteOne(productTreeStructure);
