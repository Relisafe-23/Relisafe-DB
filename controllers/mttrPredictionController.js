import mttrPrediction from "../models/mttrPredictionModel.js";
import productTreeStructure from "../models/productTreeStructure.js";
import project from "../models/projectModel.js";
import { deleteOne } from "./baseController.js";
import mill472Procedure from "../models/mil472ProcedureMttrModel.js";

export async function createMttrPrediction(req, res, next) {
  try {
    const data = req.body;

    const createData = await mttrPrediction.create({
      repairable: data.repairable,
      levelOfReplace: data.levelOfReplace,
      levelOfRepair: data.levelOfRepair,
      spare: data.spare,
      mct: data.mct,
      mlh: data.mlh,
      totalLabourHr: data.totalLabourHr,
      mMax: data.mMax,
      mttr: data.mttr,
      remarks: data.remarks,
      taskType: data.taskType,
      time: data.time,
      noOfLabours: data.noOfLabours,
      skills: data.skills,
      tools: data.tools,
      toolsPartNo: data.toolsPartNo,
      toolType: data.toolType,
      companyId: data.companyId,
      projectId: data.projectId,
      productId: data.productId,
    });

    res.status(201).json({
      message: "Mttr Prediction Created Successfully",
      data: createData,
    });

    const editDetail = await mttrPrediction.findByIdAndUpdate(
      data.mttrId,
      editedData,
      {
        new: true,
        runValidators: true,
      }
    );

    let updateExistTree = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const updateExistTreeStructure = updateExistTree?.treeStructure;

    updateNodeIntoTree(
      updateExistTreeStructure,
      data.productId,
      updateExistTree.id
    );
    let updateData;

    async function updateNodeIntoTree(node, nodeId, id) {
      if (node.id == nodeId) {
        // if (node.type === "Product") {
        (node.mct = data.mct),
          (node.mlh = data.mlh),
          (node.mttr = data.mttr),
          (updateData = await productTreeStructure.findByIdAndUpdate(
            data.treeStructureId,
            {
              treeStructure: updateExistTreeStructure,
            }
          ));
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          updateNodeIntoTree(node.children[i], nodeId, id);
        }
      }
    }
    res.status(201).json({
      message: " Mttr Prediction Updated Successfully",
      editDetail,
    });
    // find length for update each item after update
    let parentNodeData = [];
    let existTreeLength = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const treeStructureLength = existTreeLength?.treeStructure;

    findMttrNodeLength(treeStructureLength, data.productId, existTreeLength.id);
    async function findMttrNodeLength(node, nodeId, id) {
      if (node.status === "active") {
        parentNodeData.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findMttrChildNodeLength(node.children[i], nodeId, id);
        }
      }
      async function findMttrChildNodeLength(node) {
        if (node.status === "active") {
          parentNodeData.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrChildNodeLength(node.children[i], nodeId, id);
          }
        }
      }
    }

    let i = 0;

    while (i < parentNodeData.length) {
      //update MCH and MLH to tree structure product
      let existTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });

      const treeStructure = existTree?.treeStructure;

      updateNodeIntoTree(treeStructure, data.productId, existTree.id);

      async function updateNodeIntoTree(node, nodeId, id) {
        if (
          node.id == data.productId &&
          node.status === "active" &&
          node.children.length === 0
        ) {
          const frRate = parseInt(node.fr);
          const mctValue = parseInt(node.mct);
          let mttrValue = Math.abs((frRate * mctValue) / frRate);
          if (node.category === "Assembly") {
            if (node.id == data.productId) {
              if (mttrValue > 0) {
                node.mct = node.mct;
                node.mlh = node.mlh;
                node.mttr = mttrValue;
                await productTreeStructure.findByIdAndUpdate(id, {
                  treeStructure: treeStructure,
                });
              }
            }
          } else {
            node.mct = node.mct;
            node.mlh = node.mlh;
            await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
              treeStructure: treeStructure,
            });
          }
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], nodeId, id);
          }
        }

        async function findNodeFromTree(node, nodeId, id) {
          if (
            node.id == data.productId &&
            node.status === "active" &&
            node.children.length === 0
          ) {
            node.mct = node.mct;
            node.mlh = node.mlh;
            await productTreeStructure.findByIdAndUpdate(id, {
              treeStructure: treeStructure,
            });
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }
      //update every parent product mttr value
      let existTree1 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const treeStructure1 = existTree1?.treeStructure;
      let parentNode = [];
      let totatFrpRate = 0;

      updateMttrNodeIntoTree(treeStructure1, data.productId, existTree1.id);
      async function updateMttrNodeIntoTree(node, nodeId, id) {
        if (node.status === "active") {
          parentNode.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findMttrNodeFromTree(node) {
          if (node.status === "active") {
            parentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              if (node.children[i].children.length >= 1) {
                findMttrNodeFromTree(node.children[i], nodeId, id);
              }
            }
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMttrNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = parentNode.length - 1; i >= 0; i--) {
        calcMttrNodeFromTree(parentNode[i], parentNode[i].id, existTree1.id);
      }

      async function calcMttrNodeFromTree(node, parentNodeId, id) {
        if (node.children != null) {
          let frMctMulValue = 0;
          let frMctTotalMulValue = 0;
          let frMctAddValue = 0;
          let frMctTotalValue = 0;
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].fr &&
              node.children[i].status === "active"
            ) {
              frMctMulValue = node.children[i].fr * node.children[i].mct;
              frMctAddValue = frMctAddValue + node.children[i].fr;
              frMctTotalMulValue = frMctTotalMulValue + frMctMulValue;
              frMctTotalValue = frMctTotalMulValue / frMctAddValue;
            }
          }
          for (let i = 0; i < parentNode.length; i++) {
            updateMttrParentNode(node, parentNodeId, frMctTotalValue, id);
          }
        }
        async function updateMttrParentNode(
          node,
          parentNodeId,
          frMctTotalValue,
          id
        ) {
          if (
            node.id == parentNodeId &&
            node.status === "active" &&
            node.category === "Assembly"
          ) {
            if (frMctTotalValue > 0) {
              node.mct = node.mct;
              node.mlh = node.mlh;
              node.mttr = frMctTotalValue;
              await productTreeStructure.findByIdAndUpdate(id, {
                treeStructure: treeStructure1,
              });
            }
            const mttrIdData = await mttrPrediction.findOne({
              projectId: data.projectId,
              productId: node.id,
            });

            if (mttrIdData != null) {
              const editedMttrData = {
                mttr: frMctTotalValue,
              };
              const editMttrDetail = await mttrPrediction.findByIdAndUpdate(
                mttrIdData.id,
                editedMttrData,
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          }
        }
      }

      //update parent mttr values
      let existTree2 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const treeStructure2 = existTree2?.treeStructure;

      let multipleMctValue = 0;
      let addFrpValue = 0;
      let totalParentFrpValue = 0;

      let childNodeData = [];

      updateParentMttrNode(treeStructure2, data.productId, existTree2.id);

      async function updateParentMttrNode(node, nodeId, id) {
        if (node.status === "active" && node.children.length === 0) {
          childNodeData.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrChildNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findMttrChildNodeFromTree(node) {
          if (node.status === "active" && node.children.length === 0) {
            childNodeData.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMttrChildNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = 0; i < childNodeData.length; i++) {
        if (
          childNodeData[i].fr &&
          childNodeData[i].mct &&
          childNodeData[i].status === "active"
        ) {
          totalParentFrpValue = totalParentFrpValue + childNodeData[i].fr;
          multipleMctValue =
            multipleMctValue + childNodeData[i].fr * childNodeData[i].mct;
        }
      }

      // find parent mttr id
      let parentMttrTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const parentMttrNode = parentMttrTree?.treeStructure;

      calcMttrParentNodeTree(
        parentMttrNode,
        parentMttrNode.id,
        totalParentFrpValue,
        multipleMctValue,
        parentMttrTree.id
      );

      async function calcMttrParentNodeTree(
        node,
        nodeId,
        totalFrp,
        totalMctValue,
        id
      ) {
        let finalMttrValue = totalMctValue / totalFrp;

        if (node.id == nodeId && node.category === "Assembly") {
          node.mttr = finalMttrValue;
          node.mct = node.mct;
          node.mlh = node.mlh;

          await productTreeStructure.findByIdAndUpdate(parentMttrTree.id, {
            treeStructure: parentMttrNode,
          });
          const mttrIdData = await mttrPrediction.findOne({
            projectId: data.projectId,
            productId: parentMttrNode.id,
          });

          if (mttrIdData != null) {
            const editedMttrData = {
              mttr: finalMttrValue,
            };
            const editMmaxDetail = await mttrPrediction.findByIdAndUpdate(
              mttrIdData.id,
              editedMttrData,
              {
                new: true,
                runValidators: true,
              }
            );
          }
        }
      }

      //update product mmax value

      let existMmaxTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const mMaxTreeStructure = existMmaxTree?.treeStructure;
      let mMaxParentNode = [];

      updateMmaxNodeIntoTree(mMaxTreeStructure, existMmaxTree.id);

      async function updateMmaxNodeIntoTree(node, id) {
        if (node.status === "active" && node.children.length === 0) {
          mMaxParentNode.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMmaxNodeFromTree(node.children[i], id);
          }
        }
        async function findMmaxNodeFromTree(node) {
          if (node.status === "active" && node.children.length === 0) {
            mMaxParentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMmaxNodeFromTree(node.children[i], id);
            }
          }
        }
      }

      let mctLogValue = 0;
      let mctLogCount = 0;

      // find log of mct
      for (let i = 0; i < mMaxParentNode.length; i++) {
        calcMmaxNodeFromTree(
          mMaxParentNode[i],
          mMaxParentNode[i].id,
          existMmaxTree.id
        );
      }

      async function calcMmaxNodeFromTree(node) {
        if (node.children.length === 0 && node.mct) {
          mctLogValue = mctLogValue + Math.log10(node.mct);

          mctLogCount = mctLogCount + 1;
        } else if (node.children.length != 0) {
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].status === "active" &&
              node.children[i].children.length === 0
            ) {
              mctLogValue = mctLogValue + Math.log10(node.children[i].mct);
              mctLogCount = mctLogCount + 1;
            }
          }
        }
      }
      let converToPowerValue = Math.pow(mctLogValue, 2);

      let logMctValue1 = converToPowerValue / mctLogCount;

      // find log of mct 2

      let logMctValueNew = 0;
      for (let i = 0; i < mMaxParentNode.length; i++) {
        calcMmaxNodeFromTree2(mMaxParentNode[i], logMctValue1);
      }

      async function calcMmaxNodeFromTree2(node, logMctValue1) {
        if (node.children.length === 0 && node.mct) {
          mctLogValue = mctLogValue + Math.log10(node.mct);

          mctLogCount = mctLogCount + 1;
        } else if (node.children.length != 0) {
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].status === "active" &&
              node.children[i].children.length === 0
            ) {
              let mctLogValue = Math.log10(node.children[i].mct);

              let squreValueofMct = Math.pow(mctLogValue, 2);
              let addNewValue = squreValueofMct - logMctValue1;
              logMctValueNew = logMctValueNew + addNewValue;
            }
          }
        }
      }

      let logMctValue2 = (logMctValueNew / (mctLogCount - 1)) * -1;

      let logMctValue2SqrtValue = Math.sqrt(logMctValue2);

      // find parent mttr id
      let existMttrTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const mMttrTreeStructure = existMttrTree?.treeStructure;

      // find pi value of this project
      let projectPiValue = await project.findOne({
        _id: data.projectId,
      });
      let parentMttrValue = mMttrTreeStructure.mttr;
      let parentMttrLogValue = Math.log10(parentMttrValue);

      let piValue = projectPiValue.mMaxValue;

      let finalValue = piValue * logMctValue2SqrtValue;

      let finalMmaxValue = parentMttrLogValue + finalValue;

      const mttrIdData = await mttrPrediction.findOne({
        projectId: data.projectId,
        productId: mMttrTreeStructure.id,
      });
      if (mttrIdData != null) {
        let newMmax = finalMmaxValue ? finalMmaxValue : 0;

        let finalMmax = mMaxParentNode.length >= 2 ? newMmax : 0;

        const editedMmaxData = {
          mMax: finalMmax,
        };
        const editMmaxDetail = await mttrPrediction.findByIdAndUpdate(
          mttrIdData.id,
          editedMmaxData,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      i++;
    }
  } catch (error) {
    next(error);
  }
}

export async function updateMttrPrediction(req, res, next) {
  try {
    const data = req.body;

    const editedData = {
      repairable: data.repairable,
      levelOfReplace: data.levelOfReplace,
      levelOfRepair: data.levelOfRepair,
      spare: data.spare,
      mct: data.mct,
      mlh: data.mlh,
      totalLabourHr: data.totalLabourHr,
      mMax: data.mMax,
      mttr: data.mttr,
      remarks: data.remarks,
      taskType: data.taskType,
      time: data.time,
      noOfLabours: data.noOfLabours,
      skills: data.skills,
      tools: data.tools,
      toolsPartNo: data.toolsPartNo,
      toolType: data.toolType,
      companyId: data.companyId,
      projectId: data.projectId,
      productId: data.productId,
    };

    const editDetail = await mttrPrediction.findByIdAndUpdate(
      data.mttrId,
      editedData,
      {
        new: true,
        runValidators: true,
      }
    );


    let updateExistTree = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const updateExistTreeStructure = updateExistTree?.treeStructure;

    updateNodeIntoTree(
      updateExistTreeStructure,
      data.productId,
      updateExistTree.id
    );
    let updateData;

    async function updateNodeIntoTree(node, nodeId, id) {
      if (node.id == nodeId) {
        (
          // if (node.type === "Product") {
          (node.mct = data.mct)
        ),
          (node.mlh = data.mlh),
          (node.mttr = data.mttr),
          (
            (updateData = await productTreeStructure.findByIdAndUpdate(
              data.treeStructureId,
              {
                treeStructure: updateExistTreeStructure,
              }
            ))
          );
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          updateNodeIntoTree(node.children[i], nodeId, id);
        }
      }
    }
    res.status(201).json({
      message: " Mttr Prediction Updated Successfully",
      editDetail,
    });
    // find length for update each item after update
    let parentNodeData = [];
    let existTreeLength = await productTreeStructure.findOne({
      _id: data.treeStructureId,
    });

    const treeStructureLength = existTreeLength?.treeStructure;

    findMttrNodeLength(treeStructureLength, data.productId, existTreeLength.id);
    async function findMttrNodeLength(node, nodeId, id) {
      if (node.status === "active") {
        parentNodeData.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findMttrChildNodeLength(node.children[i], nodeId, id);
        }
      }
      async function findMttrChildNodeLength(node) {
        if (node.status === "active") {
          parentNodeData.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrChildNodeLength(node.children[i], nodeId, id);
          }
        }
      }
    }

    let i = 0;

    while (i < parentNodeData.length) {
      //update MCH and MLH to tree structure product
      let existTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });

      const treeStructure = existTree?.treeStructure;

      updateNodeIntoTree(treeStructure, data.productId, existTree.id);

      async function updateNodeIntoTree(node, nodeId, id) {
        if (
          node.id == data.productId &&
          node.status === "active" &&
          node.children.length === 0
        ) {
          const frRate = parseInt(node.fr);
          const mctValue = parseInt(node.mct);
          let mttrValue = Math.abs((frRate * mctValue) / frRate);
         
          if (node.category === "Assembly") {
            if (node.id == data.productId) {
              console.log("mttrValue......",mttrValue)
              if (mttrValue > 0) {
                node.mct = node.mct;
                node.mlh = node.mlh;
                node.mttr = mttrValue;
                await productTreeStructure.findByIdAndUpdate(id, {
                  treeStructure: treeStructure,
                });
              }
            }
          } else {
            node.mct = node.mct;
            node.mlh = node.mlh;
            await productTreeStructure.findByIdAndUpdate(data.treeStructureId, {
              treeStructure: treeStructure,
            });
          }
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], nodeId, id);
          }
        }

        async function findNodeFromTree(node, nodeId, id) {
          if (
            node.id == data.productId &&
            node.status === "active" &&
            node.children.length === 0
          ) {
            node.mct = node.mct;
            node.mlh = node.mlh;
            await productTreeStructure.findByIdAndUpdate(id, {
              treeStructure: treeStructure,
            });
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }
      //update every parent product mttr value
      let existTree1 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const treeStructure1 = existTree1?.treeStructure;
      let parentNode = [];
      let totatFrpRate = 0;

      updateMttrNodeIntoTree(treeStructure1, data.productId, existTree1.id);
      async function updateMttrNodeIntoTree(node, nodeId, id) {
        if (node.status === "active") {
          parentNode.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findMttrNodeFromTree(node) {
          if (node.status === "active") {
            parentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              if (node.children[i].children.length >= 1) {
                findMttrNodeFromTree(node.children[i], nodeId, id);
              }
            }
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMttrNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = parentNode.length - 1; i >= 0; i--) {
        calcMttrNodeFromTree(parentNode[i], parentNode[i].id, existTree1.id);
      }

      async function calcMttrNodeFromTree(node, parentNodeId, id) {
        if (node.children != null) {
          let frMctMulValue = 0;
          let frMctTotalMulValue = 0;
          let frMctAddValue = 0;
          let frMctTotalValue = 0;
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].fr &&
              node.children[i].status === "active"
            ) {
              frMctMulValue = node.children[i].fr * node.children[i].mct;
              frMctAddValue = frMctAddValue + node.children[i].fr;
              frMctTotalMulValue = frMctTotalMulValue + frMctMulValue;
              frMctTotalValue = frMctTotalMulValue / frMctAddValue;
            }
          }
          for (let i = 0; i < parentNode.length; i++) {
            updateMttrParentNode(node, parentNodeId, frMctTotalValue, id);
          }
        }
        async function updateMttrParentNode(
          node,
          parentNodeId,
          frMctTotalValue,
          id
        ) {
          if (
            node.id == parentNodeId &&
            node.status === "active" &&
            node.category === "Assembly"
          ) {
            if (frMctTotalValue > 0) {
              console.log("6666.....", frMctTotalValue);
              node.mct = node.mct;
              node.mlh = node.mlh;
              node.mttr = frMctTotalValue;
              await productTreeStructure.findByIdAndUpdate(id, {
                treeStructure: treeStructure1,
              });
            }
            const mttrIdData = await mttrPrediction.findOne({
              projectId: data.projectId,
              productId: node.id,
            });

            if (mttrIdData != null) {
              const editedMttrData = {
                mttr: frMctTotalValue,
              };
              const editMttrDetail = await mttrPrediction.findByIdAndUpdate(
                mttrIdData.id,
                editedMttrData,
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          }
        }
      }

      //update parent mttr values
      let existTree2 = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const treeStructure2 = existTree2?.treeStructure;

      let multipleMctValue = 0;
      let addFrpValue = 0;
      let totalParentFrpValue = 0;

      let childNodeData = [];

      updateParentMttrNode(treeStructure2, data.productId, existTree2.id);

      async function updateParentMttrNode(node, nodeId, id) {
        if (node.status === "active" && node.children.length === 0) {
          childNodeData.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMttrChildNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findMttrChildNodeFromTree(node) {
          if (node.status === "active" && node.children.length === 0) {
            childNodeData.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMttrChildNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }

      for (let i = 0; i < childNodeData.length; i++) {
        if (
          childNodeData[i].fr &&
          childNodeData[i].mct &&
          childNodeData[i].status === "active"
        ) {
          totalParentFrpValue = totalParentFrpValue + childNodeData[i].fr;
          multipleMctValue =
            multipleMctValue + childNodeData[i].fr * childNodeData[i].mct;
        }
      }

      // find parent mttr id
      let parentMttrTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const parentMttrNode = parentMttrTree?.treeStructure;

      calcMttrParentNodeTree(
        parentMttrNode,
        parentMttrNode.id,
        totalParentFrpValue,
        multipleMctValue,
        parentMttrTree.id
      );

      async function calcMttrParentNodeTree(
        node,
        nodeId,
        totalFrp,
        totalMctValue,
        id
      ) {
        let finalMttrValue = totalMctValue / totalFrp;
        console.log("finalMttrValue...7......", finalMttrValue);

        if (node.id == nodeId && node.category === "Assembly") {
          if(finalMttrValue > 0){
 node.mttr = finalMttrValue;
          }
         
          node.mct = node.mct;
          node.mlh = node.mlh;

          await productTreeStructure.findByIdAndUpdate(parentMttrTree.id, {
            treeStructure: parentMttrNode,
          });
          const mttrIdData = await mttrPrediction.findOne({
            projectId: data.projectId,
            productId: parentMttrNode.id,
          });
          console.log("888.....",finalMttrValue)

          if (mttrIdData != null  && finalMttrValue > 0) {
            const editedMttrData = {
              mttr: finalMttrValue,
            };
            const editMmaxDetail = await mttrPrediction.findByIdAndUpdate(
              mttrIdData.id,
              editedMttrData,
              {
                new: true,
                runValidators: true,
              }
            );
          }
        }
      }

      //update product mmax value

      let existMmaxTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const mMaxTreeStructure = existMmaxTree?.treeStructure;
      let mMaxParentNode = [];

      updateMmaxNodeIntoTree(mMaxTreeStructure, existMmaxTree.id);

      async function updateMmaxNodeIntoTree(node, id) {
        if (node.status === "active" && node.children.length === 0) {
          mMaxParentNode.push(node);
        }

        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findMmaxNodeFromTree(node.children[i], id);
          }
        }
        async function findMmaxNodeFromTree(node) {
          if (node.status === "active" && node.children.length === 0) {
            mMaxParentNode.push(node);
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findMmaxNodeFromTree(node.children[i], id);
            }
          }
        }
      }

      let mctLogValue = 0;
      let mctLogCount = 0;

      // find log of mct
      for (let i = 0; i < mMaxParentNode.length; i++) {
        calcMmaxNodeFromTree(
          mMaxParentNode[i],
          mMaxParentNode[i].id,
          existMmaxTree.id
        );
      }

      async function calcMmaxNodeFromTree(node) {
        if (node.children.length === 0 && node.mct) {
          mctLogValue = mctLogValue + Math.log10(node.mct);

          mctLogCount = mctLogCount + 1;
        } else if (node.children.length != 0) {
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].status === "active" &&
              node.children[i].children.length === 0
            ) {
              mctLogValue = mctLogValue + Math.log10(node.children[i].mct);
              mctLogCount = mctLogCount + 1;
            }
          }
        }
      }
      let converToPowerValue = Math.pow(mctLogValue, 2);

      let logMctValue1 = converToPowerValue / mctLogCount;

      // find log of mct 2

      let logMctValueNew = 0;
      for (let i = 0; i < mMaxParentNode.length; i++) {
        calcMmaxNodeFromTree2(mMaxParentNode[i], logMctValue1);
      }

      async function calcMmaxNodeFromTree2(node, logMctValue1) {
        if (node.children.length === 0 && node.mct) {
          mctLogValue = mctLogValue + Math.log10(node.mct);

          mctLogCount = mctLogCount + 1;
        } else if (node.children.length != 0) {
          for (let i = 0; i < node.children.length; i++) {
            if (
              node.children[i].mct &&
              node.children[i].status === "active" &&
              node.children[i].children.length === 0
            ) {
              let mctLogValue = Math.log10(node.children[i].mct);

              let squreValueofMct = Math.pow(mctLogValue, 2);
              let addNewValue = squreValueofMct - logMctValue1;
              logMctValueNew = logMctValueNew + addNewValue;
            }
          }
        }
      }

      let logMctValue2 = (logMctValueNew / (mctLogCount - 1)) * -1;

      let logMctValue2SqrtValue = Math.sqrt(logMctValue2);

      // find parent mttr id
      let existMttrTree = await productTreeStructure.findOne({
        _id: data.treeStructureId,
      });
      const mMttrTreeStructure = existMttrTree?.treeStructure;

      // find pi value of this project
      let projectPiValue = await project.findOne({
        _id: data.projectId,
      });
      let parentMttrValue = mMttrTreeStructure.mttr;
      let parentMttrLogValue = Math.log10(parentMttrValue);

      let piValue = projectPiValue.mMaxValue;

      let finalValue = piValue * logMctValue2SqrtValue;

      let finalMmaxValue = parentMttrLogValue + finalValue;

      const mttrIdData = await mttrPrediction.findOne({
        projectId: data.projectId,
        productId: mMttrTreeStructure.id,
      });
      if (mttrIdData != null) {
        let newMmax = finalMmaxValue ? finalMmaxValue : 0;

        let finalMmax = mMaxParentNode.length >= 2 ? newMmax : 0;

        const editedMmaxData = {
          mMax: finalMmax,
        };
        const editMmaxDetail = await mttrPrediction.findByIdAndUpdate(
          mttrIdData.id,
          editedMmaxData,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      i++;
    }
  } catch (error) {
    next(error);
  }
}

export async function getMttrPrediction(req, res, next) {
  try {
    const id = req.params.id;

    const mttrData = await mttrPrediction
      .findOne({ _id: id })
      .populate("companyId")
      .populate("projectId")
      .populate("productId");

    res.status(200).json({
      message: "Get All Mttr Prediction Details Successfully",
      data: mttrData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllMttrPrediction(req, res, next) {
  try {
    const data = req.query;

    const mttrData = await mttrPrediction.findOne({
      projectId: data.projectId,
      productId: data.productId,
      companyId: data.companyId,
    });

    res.status(200).json({
      message: "Get Mttr Prediction Details Sucessfully",
      data: mttrData,
    });
  } catch (error) {
    next(error);
  }
}
export async function createProcedure472(req, res, next) {
  try {
    const data = req.body;
    const procedureData = await mill472Procedure.create({
      taskType: data.taskType,
      time: data.time,
      totalLabour: data.totalLabour,
      skill: data.skill,
      tools: data.tools,
      partNo: data.partNo,
      toolType: data.toolType,
      companyId: data.companyId,
      projectId: data.projectId,
      productId: data.productId,
    });
    res.status(201).json({
      message: "Mttr Mil 472 Procedure Created SuccessFully",
      procedureData,
    });
  } catch (error) {
    next(error);
  }
}
export async function getProcedure472(req, res, next) {
  try {
    const data = req.query;

    const procedureData = await mill472Procedure.find({
      companyId: data.companyId,
      projectId: data.projectId,
      productId: data.productId,
    });

    let mlhArray = [];
    let total = 0;
    let totalValue = [];
    let sumOfTotal = 0;
    let averageValue = 0;
    let mlhValue = [];
    let mlhTotal = 0;
    let totalTime = [];
    let sumOfTime = 0;

    mlhArray = procedureData;
    mlhArray.forEach((list) => {
      total = Math.abs(list.totalLabour * list.time);
      averageValue = Math.abs(list.totalLabour / list.time);
      mlhValue.push(averageValue);
      totalValue.push(total);
      totalTime.push(list.time);
    });
    const Totalmlh = totalValue.reduce((a, b) => a + b, 0);
    // find no of labour
    for (let e of totalValue) {
      sumOfTotal += e;
    }
    //find mct
    for (let time of totalTime) {
      sumOfTime += Math.abs(time);
    }

    const editedData = {
      mct: sumOfTotal,
      mlh: Totalmlh,
      totalLabourHr: sumOfTime,
    };

    const editDetail = await mttrPrediction.findByIdAndUpdate(
      data.mttrId,
      editedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Get Mttr Procedure Details Successfully",
      procedureData,
      mttrResult: {
        sumOfTotal,
        Totalmlh,
        sumOfTime,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProcedure472(req, res, next) {
  try {
    const producedureId = req.params.id;
    const data = req.body;

    const editedData = {
      taskType: data.taskType,
      time: data.time,
      totalLabour: data.totalLabour,
      skill: data.skill,
      tools: data.tools,
      partNo: data.partNo,
      toolType: data.toolType,
      companyId: data.companyId,
      projectId: data.projectId,
      productId: data.productId,
    };

    const editDetail = await mill472Procedure.findByIdAndUpdate(
      producedureId,
      editedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      message: " Updated Mttr 472 Procedure Successfully",
      editDetail,
    });
  } catch (error) {
    next(error);
  }
}
export const deleteProcedure472 = deleteOne(mill472Procedure);
export const deleteMttrPrediction = deleteOne(mttrPrediction);
