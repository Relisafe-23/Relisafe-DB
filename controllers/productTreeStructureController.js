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
    const projectData = await productTreeStructure
      .find()
      .populate("projectId")
      .populate("companyId");

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

    const processTreeStructure = async (list) => {
      const addParentProduct = list.treeStructure;
      if (addParentProduct.status === "active") {
        allProductData.push(addParentProduct);
      }

      const childNode = addParentProduct.children;
      await getNodeTreeProduct(childNode);
    };

    const getNodeTreeProduct = async (childNode) => {
      if (childNode != null) {
        const promises = childNode.map(async (node) => {
          if (node.status === "active") {
            allProductData.push(node);
          }
          await getNodeTreeProduct(node.children);
        });
        await Promise.all(promises);
      }
    };

    // Process all top-level nodes concurrently
    await Promise.all(treeStructure.map(processTreeStructure));

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

export async function getParticularProduct(req, res, next) {
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

    
    let found = false; // Flag to indicate if the matching element is found
let nextElementData = null; // Variable to store the first next element data

allProductData.forEach((mList, index) => {
  if (!found && mList.id == data.treeStructureId) {
    const currentIndexCount = mList.indexCount.toString(); // Convert indexCount to a string
    const currentIndexParts = currentIndexCount.split('.'); // Split into integer and decimal parts
    const nextIndexCount = currentIndexParts[0] + '.' + (parseInt(currentIndexParts[1]) + 1); // Increment decimal part by 1
    // Find the first next element
    const nextElement = allProductData.find(
      (item) => item.indexCount.toString() === nextIndexCount
    );
   
    if (nextElement) {
      found = true;
      nextElementData = nextElement; // Store the next element data
    } else {
      console.log("No next element found.");
    }
  }
});

// Send the response outside the loop
console.log("nextElementData......", nextElementData)
if (nextElementData) {
  res.status(201).json({
    message: "Get Product List Tree Structure",
    data: nextElementData,
  });
} else {
  // If no next element is found, send an appropriate response
  res.status(404).json({
    message: "No next element found.",
  });
}

  } catch (err) {}
}

export const deleteproductTreeStructure = deleteOne(productTreeStructure);
