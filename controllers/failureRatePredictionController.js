import FailureRatePrediction from "../models/failureRatePredictionModel.js";
import product from "../models/productModel.js";
import productTreeStructure from "../models/productTreeStructure.js";
import {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
} from "./baseController.js";
import nprdFrpData from "../models/nprdFrp2016Model.js";
import nprdPartDescData from "../models/nprdPartDesc2016Model.js";
import nprdPartTypeData from "../models/nprdPartType2016Model.js";

export async function createFailureRatePrediction(req, res, next) {
  try {
    const data = req.body;

    const existData = {
      productId: data.productId,
      projectId: data.projectId,
      companyId: data.companyId,
    };

    const field = parseFloat(data?.field);
    const predicted = parseFloat(data?.predicted);
    const allocated = parseFloat(data?.allocated);
    const otherFr = parseFloat(data?.otherFr);
    const qty = parseFloat(data?.quantity);
    const dutyCycle = parseFloat(data?.dutyCycle);

    let frpRate;
    if (field && data.source === "Field") {
      frpRate = eval(
        field * qty * dutyCycle + data.frOffsetOperand + data.failureRateOffset
      );
    } else if (predicted && data.source === "Predicted") {
      frpRate = eval(
        predicted * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    } else if (allocated && data.source === "Allocated") {
      frpRate = eval(
        allocated * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    } else {
      frpRate = eval(
        otherFr * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    }

    const exist = await FailureRatePrediction.find(existData);

    const frpId = exist[0]?.id;

    if (Math.sign(frpRate) === -1) {
      res.status(201).json({
        message: "FRP Rate Cannot Accept Negative Value",
      });
    } else {
      if (exist.length == 0) {
        let createData = {
          predicted: data.predicted,
          field: data.field,
          dutyCycle: data.dutyCycle,
          otherFr: data.otherFr,
          frDistribution: data.frDistribution,
          allocated: data.allocated,
          frRemarks: data.frRemarks,
          failureRateOffset: data.failureRateOffset,
          frOffsetOperand: data.frOffsetOperand,
          standard: data.standard,
          frpRate: frpRate,
          frUnit: data.frUnit,
          source: data.source,
          productId: data.productId,
          projectId: data.projectId,
          companyId: data.companyId,
          treeStructureId: data.treeStructureId,
        };

        const createFailureRatePrediction = await FailureRatePrediction.create(
          createData
        );
        res.status(201).json({
          message: "FRP Created Successfuly",
          data: {
            createFailureRatePrediction,
          },
        });
      }
    }

    //update fr rate to tree structure product

    let existTree = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });
    const treeStructure = existTree?.treeStructure;

    updateNodeIntoTree(treeStructure, data.productId, existTree.id);

    async function updateNodeIntoTree(node, productId, id) {
      if (node.id == data.productId) {
        node.fr = frpRate;
        await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
          treeStructure: treeStructure,
        });
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findNodeFromTree(node.children[i], productId, id);
        }
      }
      async function findNodeFromTree(node, productId, id) {
        if (node.id == data.productId) {
          node.fr = frpRate;
          await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
            treeStructure: treeStructure,
          });
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], productId, id);
          }
        }
      }
    }

    // find length for update each item after update
    let parentNode = [];
    let existTree1 = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const treeStructure1 = existTree1?.treeStructure;
    let totatFrpRate = 0;

    updateFrpNodeIntoTree(treeStructure1, data.productId, existTree1.id);
    async function updateFrpNodeIntoTree(node, nodeId, id) {
      if (node.status === "active") {
        parentNode.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findFrpNodeFromTree(node.children[i], nodeId, id);
        }
      }
      async function findFrpNodeFromTree(node) {
        if (node.status === "active") {
          parentNode.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findFrpNodeFromTree(node.children[i], nodeId, id);
          }
        }
      }
    }

    let i = 0;
    while (i < parentNode.length) {
      //update fr rate from bottom to top
      let parentNode = [];
      let existTree1 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });

      const treeStructure1 = existTree1?.treeStructure;
      let totatFrpRate = 0;

      updateFrpNodeIntoTree(treeStructure1, data.productId, existTree1.id);
      async function updateFrpNodeIntoTree(node, nodeId, id) {
        if (node.status === "active") {
          parentNode.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findFrpNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findFrpNodeFromTree(node) {
          if (node.children.length >= 1 && node.status === "active") {
            parentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findFrpNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = parentNode.length - 1; i >= 0; i--) {
        calcFrpNodeFromTree(parentNode[i], parentNode[i].id, existTree1.id);
      }

      async function calcFrpNodeFromTree(node, parentNodeId, id) {
        let childFrpRate = 0;
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].fr && node.children[i].status === "active") {
              childFrpRate = childFrpRate + node.children[i].fr;
              node.fr = childFrpRate;
            }
          }

          for (let i = 0; i < parentNode.length; i++) {
            updateParentNode(parentNode[i], parentNodeId, childFrpRate, id);
          }
        }
        async function updateParentNode(node, parentNodeId, childFrpRate, id) {
          if (node.id == parentNodeId) {
            if (childFrpRate > 0) {
              node.fr = childFrpRate;
              await productTreeStructure.findByIdAndUpdate(id, {
                treeStructure: treeStructure1,
              });
            }
          }
        }
      }
      i++;
    }
  } catch (error) {
    next(error);
  }
}

export async function updateFailureRatePrediction(req, res, next) {
  try {
    const data = req.body;
    const field = parseFloat(data?.field);
    const predicted = parseFloat(data?.predicted);
    const allocated = parseFloat(data?.allocated);
    const otherFr = parseFloat(data?.otherFr);
    const qty = parseFloat(data?.quantity);
    const dutyCycle = parseFloat(data?.dutyCycle);

    let frpRate;
    if (field && data.source === "Field") {
      frpRate = eval(
        field * qty * dutyCycle + data.frOffsetOperand + data.failureRateOffset
      );
    } else if (predicted && data.source === "Predicted") {
      frpRate = eval(
        predicted * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    } else if (allocated && data.source === "Allocated") {
      frpRate = eval(
        allocated * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    } else {
      frpRate = eval(
        otherFr * qty * dutyCycle +
          data.frOffsetOperand +
          data.failureRateOffset
      );
    }

    if (Math.sign(frpRate) === -1) {
      res.status(201).json({
        message: "FRP Rate Cannot Accept Negative Value",
      });
    } else {
      let editData = {
        predicted: data.predicted,
        field: data.field,
        dutyCycle: data.dutyCycle,
        otherFr: data.otherFr,
        frDistribution: data.frDistribution,
        allocated: data.allocated,
        frRemarks: data.frRemarks,
        failureRateOffset: data.failureRateOffset,
        frOffsetOperand: data.frOffsetOperand,
        frUnit: data.frUnit,
        frpRate: frpRate,
        source: data.source,
        standard: data.standard,
        productId: data.productId,
        projectId: data.projectId,
        companyId: data.companyId,
        treeStructureId: data.treeStructureId,
      };
      const createFailureRatePrediction =
        await FailureRatePrediction.findByIdAndUpdate(data.frpId, editData, {
          new: true,
          runValidators: true,
        });
      res.status(201).json({
        message: "FRP Updated Successfuly",
        data: {
          createFailureRatePrediction,
        },
      });
    }

    //update fr rate to tree structure product
    let existTree = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });
    const treeStructure = existTree?.treeStructure;

    updateNodeIntoTree(treeStructure, data.productId, existTree.id);

    async function updateNodeIntoTree(node, productId, id) {
      if (node.id == data.productId) {
        node.fr = frpRate;
        await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
          treeStructure: treeStructure,
        });
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findNodeFromTree(node.children[i], productId, id);
        }
      }
      async function findNodeFromTree(node, productId, id) {
        if (node.id == data.productId) {
          node.fr = frpRate;
          await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
            treeStructure: treeStructure,
          });
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], productId, id);
          }
        }
      }
    }

    // find length for update each item after update
    let parentNode = [];
    let existTree1 = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const treeStructure1 = existTree1?.treeStructure;
    let totatFrpRate = 0;

    updateFrpNodeIntoTree(treeStructure1, data.productId, existTree1.id);
    async function updateFrpNodeIntoTree(node, nodeId, id) {
      if (node.status === "active") {
        parentNode.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findFrpNodeFromTree(node.children[i], nodeId, id);
        }
      }
      async function findFrpNodeFromTree(node) {
        if (node.children.length >= 1 && node.status === "active") {
          parentNode.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findFrpNodeFromTree(node.children[i], nodeId, id);
          }
        }
      }
    }

    let i = 0;
    while (i < parentNode.length) {
      //update fr rate from bottom to top
      let parentNode = [];
      let existTree1 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });

      const treeStructure1 = existTree1?.treeStructure;
      let totatFrpRate = 0;

      updateFrpNodeIntoTree(treeStructure1, data.productId, existTree1.id);
      async function updateFrpNodeIntoTree(node, nodeId, id) {
        if (node.status === "active") {
          parentNode.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findFrpNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findFrpNodeFromTree(node) {
          if (node.children.length >= 1 && node.status === "active") {
            parentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findFrpNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = parentNode.length - 1; i >= 0; i--) {
        calcFrpNodeFromTree(parentNode[i], parentNode[i].id, existTree1.id);
      }

      async function calcFrpNodeFromTree(node, parentNodeId, id) {
        let childFrpRate = 0;
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].fr && node.children[i].status === "active") {
              childFrpRate = childFrpRate + node.children[i].fr;
              node.fr = childFrpRate;
            }
          }

          for (let i = 0; i < parentNode.length; i++) {
            updateParentNode(parentNode[i], parentNodeId, childFrpRate, id);
          }
        }
        async function updateParentNode(node, parentNodeId, childFrpRate, id) {
          if (node.id == parentNodeId) {
            if (childFrpRate > 0) {
              node.fr = childFrpRate;
              await productTreeStructure.findByIdAndUpdate(id, {
                treeStructure: treeStructure1,
              });
            }
          }
        }
      }
      i++;
    }
  } catch (error) {
    next(error);
  }
}

export async function getFailureRatePrediction(req, res, next) {
  try {
    const id = req.params.id;
    const frpData = await FailureRatePrediction.findOne({ _id: id })
      .populate("productId")
      .populate("projectId")
      .populate("companyId")
      .populate("assemblyId")
      .populate("electronicalId")
      .populate("mechanicalId");

    res.status(200).json({
      status: "success",
      message: "Get Failure Rate Prediction Successfully",
      data: frpData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllFailureRatePrediction(req, res, next) {
  try {
    const frpData = await FailureRatePrediction.find({})
      .populate("productId")
      .populate("projectId")
      .populate("companyId")
      .populate("assemblyId")
      .populate("electronicalId")
      .populate("mechanicalId");

    res.status(200).json({
      status: "success",
      message: "Get All Failure Rate Prediction Successfully",
      data: frpData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductFailureRateData(req, res, next) {
  try {
    const data = req.query;

    const frpData = await FailureRatePrediction.findOne({
      projectId: data.projectId,
      productId: data.productId,
      companyId: data.companyId,
    });
    res.status(200).json({
      frpData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNprd2016Datas(req, res, next) {
  try {
    const getPartTypeData = await nprdPartTypeData.find();

    res.status(200).json({
      message: "Get Nprd Data Successfully",
      data: {
        // getFrpData,
        // getPartDescData,
        getPartTypeData,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function getNprd2016Description(req, res, next) {
  try {
    // Extract the query parameters from the request
    const { partTypeId } = req.query;

    // Build a dynamic filter object based on the provided parameters
    const filter = {};

    if (partTypeId) {
      filter.PartTypeId = Number(partTypeId);
    }

    // Query the database with the constructed filter
    const filteredData = await nprdPartDescData.find(filter);

    // Send the filtered data back to the frontend
    res.status(200).json({
      message: "Filtered Nprd Data Successfully",
      data: filteredData,
    });
  } catch (err) {
    // Handle any errors that occur
    next(err);
  }
}

export async function getNprd2016Value(req, res, next) {
  try {
    // Extract the query parameters from the request
    const { partType2016Nprd, quality, partDescrId } = req.query;

    // Build a dynamic filter object based on the provided parameters
    const filter = {};

    if (partType2016Nprd) {
      filter.PartTypeId = Number(partType2016Nprd);
    }

    if (quality) {
      filter.Quality = quality;
    }

    if (partDescrId) {
      filter.PartDescrId = Number(partDescrId); // Convert to number
    }

    // Query the database with the constructed filter
    const filteredData = await nprdFrpData.find(filter);

    // Send the filtered data back to the frontend
    res.status(200).json({
      message: "Filtered Nprd Data Successfully",
      data: filteredData,
    });
  } catch (err) {
    // Handle any errors that occur
    next(err);
  }
}

export const deleteFailureRatePrediction = deleteOne(FailureRatePrediction);
