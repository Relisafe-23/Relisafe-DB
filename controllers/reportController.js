import productTreeStructure from "../models/productTreeStructure.js";
import productBreakdownStructure from "../models/productBreakdownStructureModel.js";
import FailureRatePrediction from "../models/failureRatePredictionModel.js";
import MTTRPrediction from "../models/mttrPredictionModel.js";
import PMMRA from "../models/pmMraModel.js";
import SparePartsAnalysis from "../models/sparePartsAnalysisModel.js";
import FMECA from "../models/FMECAModel.js";
import SAFETY from "../models/safetyModel.js";

export async function getPbsReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;
    if (reportType == 0) {
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
    } else if (reportType == 1) {
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
      function filterDataByHierarchyType(allProductData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = allProductData.filter((item) => {
                const indexCountStr = String(item.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = allProductData.filter((item) => {
                const indexCountStr = String(item.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          allProductData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
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
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
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
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
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
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      // Grouping based on partType
      const groupedData = allProductData.reduce((acc, product) => {
        const partType = product.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));
      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getReliabilityReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;

    if (reportType == 0) {
      // Fetch product tree structure
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.id, // Add productId filter
        }).populate("productId");

        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        // If results found, return them
        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        // If results found, return them
        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        // If results found, return them
        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        // If results found, return them
        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const result = await FailureRatePrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");
        // If no results found, return an object with productId and null values
        if (!result) {
          return {
            productId: list,
            failureRatePrediction: null,
          };
        }

        // If results found, return them
        return {
          productId: list,
          failureRatePrediction: result,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getMaintainabilityReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;

    if (reportType == 0) {
      // Fetch product tree structure
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getPreventiveReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;

    if (reportType == 0) {
      // Fetch product tree structure
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const pmmraResult = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          pmmraData: pmmraResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getSparePartsAnanysisReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;
    if (reportType == 0) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const mttrResult = await MTTRPrediction.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const sparePartsResult = await SparePartsAnalysis.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          mttrData: mttrResult || null,
          sparePartsData: sparePartsResult || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getFmecaReport(req, res, next) {
  try {
    const data = req.query;
    const reportType = data.reportType;
    if (reportType == 0) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();
      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });
      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });
      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const fmecaData = await FMECA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        const pmmraData = await PMMRA.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          fmecaData: fmecaData || null,
          pmmraData: pmmraData || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getSafetyReport(req, res, next) {
  try {
    const data = req.query;

    const reportType = data.reportType;
    if (reportType == 0) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      // Recursively get all active products from the tree structure
      const getNodeTreeProduct = (childNode) => {
        if (childNode != null) {
          for (let i = 0; i < childNode.length; i++) {
            if (childNode[i].status == "active") {
              allProductData.push(childNode[i]);
            }
            getNodeTreeProduct(childNode[i].children);
          }
        }
      };

      treeStructure.forEach((list) => {
        const addParentProduct = list.treeStructure;
        if (addParentProduct.status == "active") {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 1) {
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

      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);
      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      function filterDataByHierarchyType(flattenedSampleData, hierarchyType) {
        return new Promise((resolve, reject) => {
          let filteredData = [];
          try {
            if (hierarchyType == 1) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return !indexCountStr.includes(".");
              });
            } else if (hierarchyType) {
              filteredData = flattenedSampleData.filter((item) => {
                const indexCountStr = String(item.productId.indexCount);
                return indexCountStr.split(".").length == hierarchyType;
              });
            }
            resolve(filteredData);
          } catch (error) {
            reject(error);
          }
        });
      }

      const hierarchyType = parseInt(data.hierarchyType);

      try {
        const filteredData = await filterDataByHierarchyType(
          flattenedSampleData,
          hierarchyType
        );

        res.status(201).json({
          message: "Get Product List Tree Structure",
          data: filteredData,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error filtering data",
          error: error.message,
        });
      }
    } else if (reportType == 2) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Assembly"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Assembly"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 3) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });

      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 4) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");
      const allProductData = [];
      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          addParentProduct.status == "active" &&
          addParentProduct.category == "Mechanical"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);
        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                childNode[i].status == "active" &&
                childNode[i].category == "Mechanical"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });
      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });
      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays
      const flattenedSampleData = sampleData.flat();

      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: flattenedSampleData,
      });
    } else if (reportType == 5) {
      const treeStructure = await productTreeStructure
        .find({ projectId: data.projectId })
        .populate("projectId")
        .populate("companyId");

      const allProductData = [];

      treeStructure.map((list) => {
        const addParentProduct = list.treeStructure;
        if (
          (addParentProduct.status == "active" &&
            addParentProduct.category == "Mechanical") ||
          addParentProduct.category == "Electronic"
        ) {
          allProductData.push(addParentProduct);
        }
        const childNode = addParentProduct.children;
        getNodeTreeProduct(childNode);

        async function getNodeTreeProduct(childNode) {
          if (childNode != null) {
            for (let i = 0; i < childNode.length; i++) {
              if (
                (childNode[i].status == "active" &&
                  childNode[i].category == "Mechanical") ||
                childNode[i].category == "Electronic"
              ) {
                allProductData.push(childNode[i]);
              }
              getNodeTreeProduct(childNode[i].children);
            }
          }
        }
      });

      const sampleDataPromises = allProductData.map(async (list) => {
        const safetyDatas = await SAFETY.findOne({
          projectId: data.projectId,
          productId: list.productId,
        }).populate("productId");

        // If no results found, return an object with productId and null values
        return {
          productId: list,
          safetyData: safetyDatas || null,
        };
      });
      const sampleData = await Promise.all(sampleDataPromises);

      // Flatten the sampleData array if it contains nested arrays

      const flattenedSampleData = sampleData.flat();

      // Grouping based on partType
      const groupedData = flattenedSampleData.reduce((acc, product) => {
        const partType = product.productId.partType || "Undefined"; // Default to 'Undefined' if partType is not specified
        if (!acc[partType]) {
          acc[partType] = [];
        }
        acc[partType].push(product);
        return acc;
      }, {});

      // Converting grouped data to an array of objects
      const groupedArray = Object.keys(groupedData).map((key, index) => ({
        partType: key,
        items: groupedData[key],
      }));
      res.status(201).json({
        message: "Get Product List Tree Structure",
        data: groupedArray,
      });
    }
  } catch (error) {
    next(error);
  }
}
