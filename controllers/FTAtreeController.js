import FTAtreeData from "../models/FTAtreeModel.js";
import FTAproduct from "../models/FTAproductModel.js";
import { ACTIVE_TREE } from "../constants/productStatus.js";
import failureRatePrediction from "../models/failureRatePredictionModel.js";

export async function createFTAtreeStructure(req, res, next) {
  try {
    const data = req.body;

    const treeIndexCount = await FTAtreeData.find({
      projectId: data.projectId,
    });

    let parentProduct = [];

    treeIndexCount.forEach((list) => {
      if (list.treeStructure.status === "active") {
        parentProduct.push(list);
      }
    });

    const treeIndex = parentProduct.length;

    const createData = await FTAproduct.create({
      projectId: data.projectId,
      companyId: data.companyId,
      gateType: data.gateType,
      name: data.name,
      description: data.description,
      calcTypes: data.calcTypes,
      missionTime: data.missionTime,
      gateId: 1,
      status: ACTIVE_TREE,
    });

    const parentId = await FTAtreeData.create({
      projectId: data.projectId,
      companyId: data.companyId,
      productId: createData._id,
      totalGateId: 1,
    });

    const createNode = {
      id: createData._id,
      indexCount: treeIndex + 1,
      gateType: data.gateType,
      name: data.name,
      description: data.description,
      calcTypes: data.calcTypes,
      missionTime: data.missionTime,
      gateId: 1,
      status: ACTIVE_TREE,
      parentId: parentId.id,
      children: [],
    };

    const updateTreeStructure = {
      treeStructure: createNode,
    };

    const updateParentNode = await FTAtreeData.findByIdAndUpdate(parentId.id, updateTreeStructure, {
      new: true,
      runValidators: true,
    });

    const updateFTAproduct = await FTAproduct.findByIdAndUpdate(
      createData._id,
      {
        parentId: updateParentNode.treeStructure.id,
      },
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
  } catch (err) {
    next(err);
  }
}

export async function updateParentFTAtreeStructure(req, res, next) {
  try {
    const nodeId = req.params.id; // Assuming you have a parameter for the node's ID.
    const data = req.body;
    // Find and update the document by its unique identifier (nodeId)
    const updatedData = await FTAtreeData.findOneAndUpdate(
      { _id: nodeId },
      {
        $set: {
          "treeStructure.description": data.description,
          "treeStructure.name": data.name,
          "treeStructure.gateType": data.gateType,
          "treeStructure.calcTypes": data.calcTypes,
          "treeStructure.missionTime": data.missionTime,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "Node not found with the specified ID.",
      });
    }

    await FTAproduct.findByIdAndUpdate(
      data.productId,
      {
        description: data.description,
        name: data.name,
        calcTypes: data.calcTypes,
        missionTime: data.missionTime,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Node updated successfully.",
      data: updatedData,
    });
  } catch (err) {
    next(err);
  }
}

export async function getFTAtreeDatas(req, res, next) {
  try {
    const data = req.params.id;
    let nodeData = await FTAtreeData.find({ projectId: data });
    const removeInactiveNodes = (nodes) => {
      // Check if nodes is an array
      if (Array.isArray(nodes)) {
        console.log("nodes....", nodes)
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i].status === 'inactive') {
            nodes.splice(i, 1); // Remove inactive node
          } else if (nodes[i].children && nodes[i].children.length > 0) {
            removeInactiveNodes(nodes[i].children); // Recursively remove inactive nodes from children
          }
        }
      } else if (nodes.children) {
        // If nodes is not an array but has children property
        const children = Array.isArray(nodes.children) ? nodes.children : [nodes.children];
        for (let i = children.length - 1; i >= 0; i--) {
          if (children[i].status === 'inactive') {
            children.splice(i, 1); // Remove inactive node
          } else if (children[i].children && children[i].children.length > 0) {
            removeInactiveNodes(children[i].children); // Recursively remove inactive nodes from children
          }
        }
      }
    };

    // Function to update tree structure under each child node
    const updateChildTreeStructure = async (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        const child = nodes[i];
        if (child.children && child.children.length > 0) {
          await updateChildTreeStructure(child.children); // Recursively update tree structure under children
        }
      }
    };

    // Remove inactive nodes from the tree structure
    removeInactiveNodes(nodeData[0].treeStructure);

    // Update tree structure under each child node
    await updateChildTreeStructure(nodeData[0].treeStructure);

    // Update the database document with the modified tree structure
    await FTAtreeData.updateOne({ projectId: data }, { treeStructure: nodeData[0].treeStructure });

    res.status(201).json({
      message: "Success",
      nodeData,
    });
  } catch (err) {
    next(err);
  }
}








export async function getFRrate(req, res, next) {
  try {
    const data = req.params;
    const getFRdata = await failureRatePrediction.findOne({
      productId: data.productId,
      projectId: data.projectId,
      treeStructureId: data.treeStructureId,
      companyId: data.companyId,
    });

    res.status(200).json({
      status: "Sucess",
      getFRdata,
    });
  } catch (err) {
    next(err);
  }
}
