import FTAtreeData from "../models/FTAtreeModel.js";
import FTAproduct from "../models/FTAproductModel.js";
import { ACTIVE_TREE } from "../constants/productStatus.js";

export async function createChildNode(req, res, next) {
  try {
    const data = req.body;

    let existTree = await FTAtreeData.find({
      projectId: data.projectId,
      companyId: data.companyId,
    });

    const productIndex = data.indexCount - 1;
    const treeStructure = existTree[productIndex]?.treeStructure;

    if (data.parentId === undefined || data.parentId === null) {
      const treeData = {
        projectId: data.projectId,
        companyId: data.companyId,
        gateType: data.gateType,
        calcTypes: data.calcTypes,
        missionTime: data.missionTime,
        name: data.name,
        description: data.description,
        gateId: data.gateId,
        isEvent: data.isEvent,
      };

      const createData = await FTAproduct.create(treeData);

      if (existTree.length === 0) {
        const createNode = [
          {
            id: createData._id,
            indexCount: "1",
            gateType: data.gateType,
            name: data.name,
            description: data.description,
            calcTypes: data.calcTypes,
            missionTime: data.missionTime,
            gateId: data.gateId,
            isEvent: data.isEvent,
            status: ACTIVE_TREE,
            children: [],
          },
        ];
        await FTAtreeData.create({
          projectId: data.projectId,
          companyId: data.companyId,
          productId: createData._id,
          totalGateId: 1,
          treeStructure: createNode,
        });
        res.status(201).json({
          message: "Created ",
        });
      } else {
        const treeIndexCount = await FTAtreeData.find({
          projectId: data.projectId,
        });

        let parentNode = [];
        treeIndexCount.forEach((list) => {
          if (list.treeStructure.status === "active") {
            parentNode.push(list);
          }
        });

        const treeIndex = parentNode.length;

        const addNode = [
          ...treeStructure,
          {
            id: createData._id,
            indexCount: `${treeIndex + 1}`,
            gateType: data.gateType,
            name: data.name,
            description: data.description,
            calcTypes: data.calcTypes,
            missionTime: data.missionTime,
            gateId: data.gateId,
            isEvent: data.isEvent,
            status: ACTIVE_TREE,
            children: [],
          },
        ];
        await FTAtreeData.findByIdAndUpdate(existTree[productIndex].id, {
          treeStructure: addNode,
        });
        res.status(201).json({
          message: "Created",
        });
      }
    } else {
      insertNodeIntoTree(treeStructure, data.parentId, existTree[productIndex].id);
      async function insertNodeIntoTree(node, nodeId, id) {
        if (node.id == nodeId) {
          const treeStructureData = await FTAtreeData.find({
            projectId: data.projectId,
          });
          const allTreeProductData = [];
          treeStructureData.map((list) => {
            const addParentProduct = list.treeStructure;

            allTreeProductData.push(addParentProduct);

            const childNode = addParentProduct.children;

            getNodeTreeProduct(childNode);

            async function getNodeTreeProduct(childNode) {
              if (childNode != null) {
                for (let i = 0; i < childNode.length; i++) {
                  allTreeProductData.push(childNode[i]);
                  getNodeTreeProduct(childNode[i].children);
                }
              }
            }
          });

          const treeIndexCount = await FTAtreeData.find({
            projectId: data.projectId,
          });

          let parentNode = [];

          treeIndexCount.forEach((list) => {
            if (list.treeStructure.status === "active") {
              parentNode.push(list);
            }
          });

          let childData = [];
          let childTreeIndex = [];
          childData = node.children;

          childData.forEach((list) => {
            if (list.status === "active") {
              childTreeIndex.push(list);
            }
          });

          const createParentNodeId = await FTAproduct.create({
            projectId: data.projectId,
            companyId: data.companyId,
            productId: node.id,
            parentId: data.parentId,
            gateType: data.gateType,
            name: data.name,
            description: data.description,
            calcTypes: data.calcTypes,
            gateId: data.gateId,
            isEvent: data.isEvent,
            status: ACTIVE_TREE,
            fr: data.fr,
            isProducts: data.isProducts,
            eventMissionTime: data.eventMissionTime,
            isP: data.isP,
            isT: data.isT,
            mttr: data.mttr,
          });

          const addNode = {
            id: createParentNodeId.id,
            productId: node.id,
            parentId: treeStructure.parentId,
            gateType: data.gateType,
            name: data.name,
            description: data.description,
            calcTypes: data.calcTypes,
            gateId: data.gateId,
            isEvent: data.isEvent,
            status: ACTIVE_TREE,
            fr: data.fr,
            isProducts: data.isProducts,
            eventMissionTime: data.eventMissionTime,
            isP: data.isP,
            isT: data.isT,
            mttr: data.mttr,
            indexCount: `${data.productCount}.${childTreeIndex.length + 1}`,
            children: [],
          };
          await node.children.push(addNode);
          await FTAtreeData.findByIdAndUpdate(id, {
            treeStructure: treeStructure,
          });
          const getTableId = treeStructureData[0];
          const getTotalGateId = getTableId.totalGateId;
          const addTotalGateId = getTotalGateId + 1;

          await FTAtreeData.findByIdAndUpdate(getTableId._id, {
            totalGateId: addTotalGateId,
          });
          res.status(201).json({
            message: "Created",
            addNode,
          });
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            insertNodeIntoTree(node.children[i], nodeId, id);
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
}

export async function updateFTAtreeStructure(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const childId = req.params.childId;
    const data = req.body;

    const treeStructureData = await FTAtreeData.findOne({
      projectId: projectId,
    });

    function updateChildTree(node) {
      if (node.id === childId) {
        node.description = data.description;
        node.gateType = data.gateType;
        node.gateId = data.gateId;
        node.name = data.name;
        node.fr = data.fr;
        node.eventMissionTime = data.eventMissionTime;
        node.isP = data.isP;
        node.isT = data.isT;
        node.mttr = data.mttr;
        node.calcTypes = data.calcTypes;
        return true;
      }

      for (let i = 0; i < node.children.length; i++) {
        if (updateChildTree(node.children[i])) {
          return true;
        }
      }

      return false;
    }
    if (updateChildTree(treeStructureData.treeStructure)) {
      await FTAtreeData.findOneAndUpdate(
        { projectId: projectId },
        { treeStructure: treeStructureData.treeStructure },
        { new: true, runValidators: true }
      );
      const demo = await FTAtreeData.findOne(
        { projectId: projectId },
        { treeStructure: treeStructureData.treeStructure }
      );

      res.status(200).json({
        message: "Child node updated successfully.",
      });
    } else {
      res.status(404).json({
        message: "Child node not found with the specified Id.",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteFTAtreeStructure(req, res, next) {
  const { parantId, deleteId } = req.params; // Note: 'parantId' is misspelled
  console.log(parantId, "- parentId");
  console.log(deleteId, "- deleteId");
  const tableId = req.query.tableParentId;
  console.log(tableId, "- tableId");
  
  try {
    const treeStructureData = await FTAtreeData.findOne({
      _id: parantId,
    });

    console.log(treeStructureData, 'vtreeStructureData');

    if (!treeStructureData) {
      return res.status(404).json({
        message: "Parent document not found."
      });
    }

    // FIX: Convert both IDs to strings for comparison
    const treeStructureId = treeStructureData.treeStructure.id.toString();
    const deleteIdStr = deleteId.toString();
    
    console.log("Comparing:", { treeStructureId, deleteIdStr });

    // Check if this is a root node deletion (treeStructure.id matches deleteId)
    if (treeStructureId === deleteIdStr) {
      console.log("Deleting entire document - root node match");
      // This is the root node - delete the entire document
      await FTAtreeData.findByIdAndDelete(parantId);
      
      return res.status(200).json({
        status: "Parent Deleted",
        message: "Root node deleted successfully.",
      });
    }

    // If tableId is provided and it's a valid ID (for parent deletion)
    if (tableId && tableId !== 'null' && tableId !== 'undefined' && tableId !== '') {
      console.log("Deleting parent document with tableId:", tableId);
      const deleteParent = await FTAtreeData.findByIdAndDelete(tableId);
      if (deleteParent) {
        return res.status(200).json({
          status: "Parent Deleted",
          message: "Parent node deleted successfully.",
        });
      }
    }

    // If we reach here, try to delete from children
    console.log("Trying to delete from children");
    
    // Deep clone the tree structure
    const treeStructure = JSON.parse(JSON.stringify(treeStructureData.treeStructure));
    
    function deleteNode(node) {
      if (!node.children || node.children.length === 0) return false;
      
      for (let i = 0; i < node.children.length; i++) {
        // Convert child ID to string for comparison
        const childId = node.children[i].id.toString();
        
        if (childId === deleteIdStr) {
          console.log("Found child to delete at index:", i);
          // Remove the child
          node.children.splice(i, 1);
          return true;
        } else if (node.children[i].children && node.children[i].children.length > 0) {
          // Recursively check deeper
          const deleted = deleteNode(node.children[i]);
          if (deleted) return true;
        }
      }
      return false;
    }

    const deleted = deleteNode(treeStructure);
    
    if (deleted) {
      console.log("Child deleted, updating document");
      // Update the document
      await FTAtreeData.findOneAndUpdate(
        { _id: parantId },
        { treeStructure: treeStructure },
        { new: true, runValidators: true }
      );

      // Update index numbers after deletion
      await updateNodeIndex(parantId);

      res.status(200).json({
        status: "Child Deleted",
        message: "Child node deleted successfully.",
      });
    } else {
      console.log("Child not found with ID:", deleteIdStr);
      res.status(404).json({
        message: "Child node not found with the specified Id.",
      });
    }
  } catch (err) {
    console.error("Error in deleteFTAtreeStructure:", err);
    next(err);
  }
}

// Update function remains the same;
async function updateNodeIndex(documentId) {
  try {
    const treeStructureData = await FTAtreeData.findOne({
      _id: documentId,
    });

    if (!treeStructureData) return;

    const treeStructure = JSON.parse(JSON.stringify(treeStructureData.treeStructure));
    
    function updateEachNode(node) {
      if (!node.children || node.children.length === 0) return;

      node.children.sort((a, b) => {
        const indexA = parseFloat(a.indexCount) || 0;
        const indexB = parseFloat(b.indexCount) || 0;
        return indexA - indexB;
      });

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        child.indexCount = `${node.indexCount}.${i + 1}`;
        
        if (child.children && child.children.length > 0) {
          updateEachNode(child);
        }
      }
    }
    
    updateEachNode(treeStructure);

    await FTAtreeData.findOneAndUpdate(
      { _id: documentId },
      { treeStructure: treeStructure },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error("Error updating indices:", error);
  }
}

export async function getLastGateId(req, res, next) {

  try {
    const data = req.params;
    let gateId = await FTAtreeData.find({
      projectId: data.projectId,
      companyId: data.companyId,
    });
    if (gateId) {
      res.status(200).json({
        status: "Success",
        gateId,
      });
    } else {
      res.status(404).json({
        status: "Not found",
        gateId,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getChildNode(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const parentId = req.params.parentId;
    const targetIndexCount = req.query.targetIndexCount;

    console.log(projectId, "projectId")
    console.log(parentId, "parentId")
    console.log(targetIndexCount, "targetIndexCount")


    const treeStructureData = await FTAtreeData.findOne({
      _id: parentId,
      projectId: projectId,
    });

    

    if (targetIndexCount === "1") {
      res.status(200).json(treeStructureData.treeStructure);
    } else {
      if (!treeStructureData) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Recursive function to find a node by indexCount
      function findNodeByIndexCount(node, targetIndexCount) {
        if (node.indexCount === targetIndexCount) {
          return node; // Found the node with the matching indexCount
        }

        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            const foundNode = findNodeByIndexCount(child, targetIndexCount);
            if (foundNode) {
              return foundNode; // Node found in this subtree
            }
          }
        }

        return null; // Node not found in this subtree
      }

      const rootNode = treeStructureData.treeStructure;
      const specificNode = findNodeByIndexCount(rootNode, targetIndexCount);

      if (specificNode) {
        // Found the specific node
        res.status(200).json(specificNode);
      } else {
        // Node with the specified indexCount not found
        res.status(404).json({ message: "Node not found with the specified indexCount." });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function FTAtree(req, res, next) {
  try {
    const id = req.params.id;

    const nodeData = await FTAtreeData.find({ _id: id });
    res.status(201).json({
      status: "Success",
      nodeData,
    });
  } catch (err) {
    next(err);
  }
}
