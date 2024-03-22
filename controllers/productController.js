import assembly from "../models/assemblyModel.js";
import electronical from "../models/electronicalModel.js";
import mechanical from "../models/mechanicalModel.js";
import product from "../models/productModel.js";
import productTreeStructure from "../models/productTreeStructure.js";
import { ACTIVE_TREE, INACTIVE_TREE } from "../constants/productStatus.js";
import FailureRatePrediction from "../models/failureRatePredictionModel.js";
import mttrPrediction from "../models/mttrPredictionModel.js";
import project from "../models/projectModel.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export async function createProduct(req, res, next) {
  try {
    const data = req.body;
    let existTree = await productTreeStructure.find({
      projectId: data.projectId,
      companyId: data.companyId,
    });

    const productIndex = data.indexCount - 1;
    const treeStructure = existTree[productIndex]?.treeStructure;

    if (data.parentId === undefined || data.parentId === null) {
      const productData = data.parentId
        ? {
            projectId: data.projectId,
            companyId: data.companyId,
            parentId: data.parentId,
            productName: data.productName,
          }
        : {
            projectId: data.projectId,
            companyId: data.companyId,
            productName: data.productName,
          };

      const createData = await product.create(productData);

      if (existTree.length === 0) {
        const createNode = [
          {
            id: createData._id,
            indexCount: "1",
            productName: data.productName,
            category: data.category,
            reference: data.reference,
            partType: data.partType,
            partNumber: data.partNumber,
            quantity: data.quantity,
            environment: data.environment,
            temperature: data.temperature,
            status: ACTIVE_TREE,
            fr: "",
            mttr: "",
            mct: "",
            mlh: "",
            children: [],
          },
        ];
        await productTreeStructure.create({
          projectId: data.projectId,
          companyId: data.companyId,
          productId: createData._id,
          treeStructure: createNode,
        });

        res.status(201).json({
          message: "Sub-Product Created Successfuly",
        });
      } else {
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

        const addNode = [
          ...treeStructure,
          {
            id: createData._id,
            indexCount: `${treeIndex + 1}`,
            productName: data.productName,
            category: data.category,
            reference: data.reference,
            partType: data.partType,
            partNumber: data.partNumber,
            quantity: data.quantity,
            environment: data.environment,
            temperature: data.temperature,
            status: ACTIVE_TREE,
            children: [],
          },
        ];
        await productTreeStructure.findByIdAndUpdate(
          existTree[productIndex].id,
          {
            treeStructure: addNode,
          }
        );
        res.status(201).json({
          message: "Sub-Product Created Successfuly",
        });
      }
    } else {
      insertNodeIntoTree(
        treeStructure,
        data.parentId,
        existTree[productIndex].id,
        data.productName
      );

      async function insertNodeIntoTree(node, nodeId, id, productName) {
        if (node.id == nodeId) {
          ///// get parent product id

          const treeStructureData = await productTreeStructure.find({
            projectId: data.projectId,
          });
          const allProductData = [];
          treeStructureData.map((list) => {
            const addParentProduct = list.treeStructure;
            allProductData.push(addParentProduct);
            const childNode = addParentProduct.children;
            getNodeTreeProduct(childNode);
            async function getNodeTreeProduct(childNode) {
              if (childNode != null) {
                for (let i = 0; i < childNode.length; i++) {
                  allProductData.push(childNode[i]);
                  getNodeTreeProduct(childNode[i].children);
                }
              }
            }
          });
          let productData = "";
          var result = allProductData.filter(function (e, i) {
            if (allProductData[i].id == data.parentId) {
              productData = e;
            }
          });

          if (
            productData.category === "Electronic" ||
            productData.category === "Mechanical"
          ) {
            res.status(400).json({
              message: `Sub-Product Not Allowed In ${productData.category}`,
            });
          } else {
            const productSubData = {
              projectId: data.projectId,
              companyId: data.companyId,
              productId: node.id,
              parentId: data.parentId,
              productName: data.productName,
              category: data.category,
              reference: data.reference,
              partType: data.partType,
              partNumber: data.partNumber,
              quantity: data.quantity,
              environment: data.environment,
              temperature: data.temperature,
              status: ACTIVE_TREE,
            };

            const createData =
              data.category === "Assembly"
                ? await assembly.create(productSubData)
                : data.category === "Electronic"
                ? await electronical.create(productSubData)
                : await mechanical.create(productSubData);

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
            let childData = [];
            let childTreeIndex = [];
            childData = node.children;
            childData.forEach((list) => {
              if (list.status === "active") {
                childTreeIndex.push(list);
              }
            });

            const addNode = {
              id: createData._id,
              productId: node.id,
              productName: data.productName,
              category: data.category,
              parentId: treeStructure.parentId,
              reference: data.reference,
              partType: data.partType,
              partNumber: data.partNumber,
              quantity: data.quantity,
              environment: data.environment,
              temperature: data.temperature,
              status: ACTIVE_TREE,
              indexCount: `${data.productCount}.${childTreeIndex.length + 1}`,
              children: [],
            };

            await node.children.push(addNode);
            await productTreeStructure.findByIdAndUpdate(id, {
              treeStructure: treeStructure,
            });
            res.status(201).json({
              message: "Sub-Product Created Successfuly",
              addNode,
            });
          }
        } else if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            insertNodeIntoTree(node.children[i], nodeId, id, productName);
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const data = req.body;

    let existTree = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });

    const treeStructureMain = existTree?.treeStructure;

    updateNodeIntoTree(treeStructureMain, data.productId, existTree.id);
    let updateData;

    async function updateNodeIntoTree(node, nodeId, id) {
      if (node.id == nodeId) {
        // if (node.type === "Product") {
        (node.productName = data.productName),
          (node.category = data.category),
          (node.reference = data.reference),
          (node.partType = data.partType),
          (node.partNumber = data.partNumber),
          (node.quantity = data.quantity),
          (node.environment = data.environment),
          (node.temperature = data.temperature),
          (updateData = await productTreeStructure.findByIdAndUpdate(
            data.productTreeStructureId,
            {
              treeStructure: treeStructureMain,
            }
          ));

        //update frp after quantity value change

        const frpValue = await FailureRatePrediction.findOne({
          productId: data.productId,
        });
        const field = frpValue ? parseFloat(frpValue.field) : null;
        const predicted = parseFloat(
          frpValue?.predicted ? frpValue.predicted : null
        );
        const allocated = parseFloat(
          frpValue?.allocated ? frpValue.allocated : null
        );
        const otherFr = parseFloat(frpValue?.otherFr ? frpValue.otherFr : null);
        const qty = parseFloat(data.quantity);
        const dutyCycle = parseFloat(
          frpValue?.dutyCycle ? frpValue.dutyCycle : null
        );

        let frpRate;

        if (frpValue) {
          // Check if 'frpValue' is not null or undefined
          if (field && frpValue.source === "Field") {
            frpRate = eval(
              field * qty * dutyCycle +
                (frpValue.frOffsetOperand || 0) + // Use 0 if 'frOffsetOperand' is falsy
                (frpValue.failureRateOffset || 0) // Use 0 if 'failureRateOffset' is falsy
            );
          } else if (predicted && frpValue.source === "Predicted") {
            frpRate = eval(
              predicted * qty * dutyCycle +
                (frpValue.frOffsetOperand || 0) +
                (frpValue.failureRateOffset || 0)
            );
          } else if (allocated && frpValue.source === "Allocated") {
            frpRate = eval(
              allocated * qty * dutyCycle +
                (frpValue.frOffsetOperand || 0) +
                (frpValue.failureRateOffset || 0)
            );
          } else {
            frpRate = eval(
              otherFr * qty * dutyCycle +
                (frpValue.frOffsetOperand || 0) +
                (frpValue.failureRateOffset || 0)
            );
          }
        } else {
          // Handle the case where 'frpValue' is null or undefined
          frpRate = null; // or some other default value
        }

        //update fr rate to tree structure product

        let existTree = await productTreeStructure.findOne({
          _id: data.productTreeStructureId,
        });
        const treeStructure = existTree?.treeStructure;

        updateNodeIntoTree(treeStructure, data.productId, existTree.id);

        async function updateNodeIntoTree(node, productId, id) {
          if (node.id == data.productId) {
            node.fr = frpRate;
            await productTreeStructure.findByIdAndUpdate(
              data.productTreeStructureId,
              {
                treeStructure: treeStructure,
              }
            );
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findNodeFromTree(node.children[i], productId, id);
            }
          }
          async function findNodeFromTree(node, productId, id) {
            if (node.id == data.productId) {
              node.fr = frpRate;
              await productTreeStructure.findByIdAndUpdate(
                data.productTreeStructureId,
                {
                  treeStructure: treeStructure,
                }
              );
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
          _id: data.productTreeStructureId,
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
            _id: data.productTreeStructureId,
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
                if (
                  node.children[i].fr &&
                  node.children[i].status === "active"
                ) {
                  childFrpRate = childFrpRate + node.children[i].fr;
                  node.fr = childFrpRate;
                }
              }

              for (let i = 0; i < parentNode.length; i++) {
                updateParentNode(parentNode[i], parentNodeId, childFrpRate, id);
              }
            }
            async function updateParentNode(
              node,
              parentNodeId,
              childFrpRate,
              id
            ) {
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
        // update mttr value after quantity edit

        let parentNodeData = [];
        let existTreeLength = await productTreeStructure.findOne({
          _id: data.productTreeStructureId,
        });

        const treeStructureLength = existTreeLength?.treeStructure;
        let singleMttrValue = [];

        findMttrNodeLength(
          treeStructureLength,
          data.productId,
          existTreeLength.id
        );
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

        let j = 0;

        while (j < parentNodeData.length) {
          //update MCH and MLH to tree structure product
          let existTree = await productTreeStructure.findOne({
            _id: data.productTreeStructureId,
          });

          const treeStructure = existTree?.treeStructure;

          updateSingleMttrNode(treeStructure, data.productId, existTree.id);

          async function updateSingleMttrNode(node, nodeId, id) {
            if (
              node.status === "active" &&
              node.children.length === 0 &&
              node.id == data.productId
            ) {
              singleMttrValue = node;
            }

            if (node.children != null) {
              for (let i = 0; i < node.children.length; i++) {
                findMttrSingleNodeFromTree(node.children[i], nodeId, id);
              }
            }
            async function findMttrSingleNodeFromTree(node) {
              if (
                node.status === "active" &&
                node.children.length === 0 &&
                node.id == data.productId
              ) {
                singleMttrValue = node;
              }
              if (node.children != null) {
                for (let i = 0; i < node.children.length; i++) {
                  findMttrSingleNodeFromTree(node.children[i], nodeId, id);
                }
              }
            }
          }

          updateNodeIntoTree(singleMttrValue, data.productId, existTree.id);

          async function updateNodeIntoTree(node, nodeId, id) {
            if (
              node.id == data.productId &&
              node.status === "active" &&
              node.children.length === 0
            ) {
              const mctValue = parseInt(data.mct);

              let mttrValue = Math.abs((node.fr * mctValue) / node.fr);

              if (node.category === "Assembly") {
                if (node.id == data.productId) {
                  if (mttrValue > 0) {
                    node.mct = data.mct;
                    node.mlh = data.mlh;
                    node.mttr = mttrValue;
                    await productTreeStructure.findByIdAndUpdate(id, {
                      treeStructure: treeStructure,
                    });
                  }
                }
              } else {
                node.mct = data.mct;
                node.mlh = data.mlh;
                await productTreeStructure.findByIdAndUpdate(
                  data.productTreeStructureId,
                  {
                    treeStructure: treeStructure,
                  }
                );
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
                node.mct = data.mct;
                node.mlh = data.mlh;
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
            _id: data.productTreeStructureId,
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
            calcMttrNodeFromTree(
              parentNode[i],
              parentNode[i].id,
              existTree1.id
            );
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
                  node.mttr = frMctTotalValue;
                  node.mct = data.mct;
                  node.mlh = data.mlh;
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
            _id: data.productTreeStructureId,
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
            _id: data.productTreeStructureId,
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
            _id: data.productTreeStructureId,
          });
          const mMaxTreeStructure = existMmaxTree?.treeStructure;
          let mMaxParentNode = [];

          updateMmaxNodeIntoTree(mMaxTreeStructure, existMmaxTree.id);

          async function updateMmaxNodeIntoTree(node, id) {
            if (node.status === "active") {
              mMaxParentNode.push(node);
            }

            if (node.children != null) {
              for (let i = 0; i < node.children.length; i++) {
                findMmaxNodeFromTree(node.children[i], id);
              }
            }
            async function findMmaxNodeFromTree(node) {
              if (node.status === "active") {
                mMaxParentNode.push(node);
              }
              if (node.children != null) {
                for (let i = 0; i < node.children.length; i++) {
                  if (node.children[i].children.length > 1) {
                    findMmaxNodeFromTree(node.children[i], id);
                  }
                }
              } else if (node.children != null) {
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
            _id: data.productTreeStructureId,
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
            let finalMmax = finalMmaxValue ? finalMmaxValue : 0;

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
          j++;
        }

        res.status(201).json({
          message: "Product Updated Successfuly",
          data: {
            existTree,
          },
        });
      } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          updateNodeIntoTree(node.children[i], nodeId, id);
        }
      }
    }
  } catch (error) {
    next(error);
  }
}
export async function deleteProduct(req, res, next) {
  try {
    const data = req.body;
    let existMainTree = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });

    let productDeleteData = [];

    let deletedData = [];

    const treeStructure = existMainTree?.treeStructure;
    let updateData;
    updateNodeIntoTree(treeStructure, data.productId, existMainTree.id);

    async function updateNodeIntoTree(node, nodeId, id) {
      if (node.status === "active") {
        productDeleteData.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          deleteNodeFromTree(node.children[i], node.children[i].id, id);
        }
      }
      async function deleteNodeFromTree(node, nodeId, id) {
        if (node.status === "active") {
          productDeleteData.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            deleteNodeFromTree(node.children[i], node.children[i].id, id);
          }
        }
      }
      for (let i = 0; i < productDeleteData.length; i++) {
        getMultipleDeleteNodeFromTree(
          productDeleteData[i],
          productDeleteData[i].id,
          id
        );
      }

      async function getMultipleDeleteNodeFromTree(node, nodeId, id) {
        if (node.id == data.productId) {
          deletedData.push(node);

          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              deleteChildNodeFromTree(
                node.children[i],
                node.children[i].id,
                id
              );
            }
          }
          async function deleteChildNodeFromTree(node, nodeId, id) {
            deletedData.push(node);
            if (node.children != null) {
              for (let i = 0; i < node.children.length; i++) {
                deleteChildNodeFromTree(
                  node.children[i],
                  node.children[i].id,
                  id
                );
              }
            }
          }
        }
      }
      for (let i = 0; i < deletedData.length; i++) {
        deleteMultipleNodeFromTree(deletedData[i], deletedData[i].id, id);
      }

      async function deleteMultipleNodeFromTree(node, nodeId, id) {
        if (node.id == nodeId) {
          node.status = INACTIVE_TREE;
          await productTreeStructure.findByIdAndUpdate(id, {
            treeStructure: treeStructure,
          });
        }
      }
    }
    // update parent product index value
    const parentData = await productTreeStructure.find({
      companyId: data.companyId,
      projectId: data.projectId,
    });

    let parentProduct = [];
    parentData.forEach((list) => {
      if (list.treeStructure.status === "active") {
        parentProduct.push(list);
      }
    });

    for (let i = 0; i < parentProduct.length; i++) {
      let parentIndexCount = i + 1;
      if (parentProduct[i].treeStructure) {
        parentProduct[i].treeStructure.indexCount = parentIndexCount;
        await productTreeStructure.findByIdAndUpdate(parentProduct[i].id, {
          treeStructure: parentProduct[i].treeStructure,
        });
      }
      let childNode = parentProduct[i].treeStructure.children;
      if (childNode != null) {
        for (let i = 0; i < childNode.length; i++) {
          let indxCount = parentIndexCount + "." + (i + 1);
          updateChildProductIndex(childNode[i], childNode[i].id, indxCount);
        }

        async function updateChildProductIndex(node, nodeId, indexCount) {
          if (node.id == nodeId) {
            node.indexCount = indexCount;
            await productTreeStructure.findByIdAndUpdate(parentProduct[i].id, {
              treeStructure: parentProduct[i].treeStructure,
            });
          }
        }
      }
    }

    //update fr rate after delete product pbs tree
    let parentNode = [];
    let existTree1 = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
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
        if (node.children.length > 1)
          if (node.status === "active") {
            parentNode.push(node);
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
          node.fr = childFrpRate;
          await productTreeStructure.findByIdAndUpdate(id, {
            treeStructure: treeStructure1,
          });
        }
      }
    }

    // update Mttr after delete pbs tree

    let existTreeMttr = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });
    const treeStructureMttr = existTreeMttr?.treeStructure;
    let mttrParentNode = [];

    updateMttrNodeIntoTree(treeStructureMttr, data.productId, existTreeMttr.id);
    async function updateMttrNodeIntoTree(node, nodeId, id) {
      if (node.status === "active") {
        mttrParentNode.push(node);
      }
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findMttrNodeFromTree(node.children[i], nodeId, id);
        }
      }
      async function findMttrNodeFromTree(node) {
        if (node.status === "active") {
          mttrParentNode.push(node);
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].children.length > 1) {
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
    //update parent mttr from the bottom each product
    let existTree2 = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });
    const treeStructure2 = existTree2?.treeStructure;

    let multipleMctValue = 0;
    let addFrpValue = 0;
    let totalParentFrpValue = 0;

    findParentNodeMttrTree(treeStructure2, data.productId, existTree2.id);
    async function findParentNodeMttrTree(node, nodeId, id) {
      if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
          findNodeFromTree(node.children[i], nodeId, id);
        }
      }
      async function findNodeFromTree(node, nodeId, id) {
        if (node.fr && node.mct && node.status === "active") {
          multipleMctValue = node.fr * node.mct;
          addFrpValue = addFrpValue + node.fr;
          totalParentFrpValue = totalParentFrpValue + multipleMctValue;
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], nodeId, id);
          }
        }
      }
      updateMttrParentTotalValue(node, addFrpValue, totalParentFrpValue, id);
      async function updateMttrParentTotalValue(
        node,
        addFrpValue,
        totalParentFrpValue,
        id
      ) {
        let totalMttr = totalParentFrpValue / addFrpValue;

        if (node.id) {
          node.mttr = totalMttr;
          await productTreeStructure.findByIdAndUpdate(id, {
            treeStructure: treeStructure2,
          });
        }
      }

      // update pbs tree index number changes particular parent tree after delete

      let updateIndexTree = await productTreeStructure.findOne({
        _id: data.productTreeStructureId,
      });
      const productIndexTreeStructure = updateIndexTree?.treeStructure;

      let updateChildProductIndexData = [];

      let firstIndex = data.indexCount;

      let productIndexCount = String(firstIndex)[0];

      let parentProductId = data.parentId;

      updateProductIndexIntoTree(
        productIndexTreeStructure,
        data.productId,
        productIndexCount,
        updateIndexTree.id
      );

      async function updateProductIndexIntoTree(node, nodeId, id) {
        if (node.id == data.parentId) {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].status === "active") {
              updateChildProductIndexData.push(node.children[i]);
            }
          }
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            findIndexNodeFromTree(node.children[i], nodeId, id);
          }
        }
        async function findIndexNodeFromTree(node) {
          if (node.id == data.parentId) {
            if (node.children != null) {
              for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].status === "active") {
                  updateChildProductIndexData.push(node.children[i]);
                }
              }
            }
            if (node.children != null) {
              for (let i = 0; i < node.children.length; i++) {
                findIndexNodeFromTree(node.children[i], nodeId, id);
              }
            }
          } else if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              findIndexNodeFromTree(node.children[i], nodeId, id);
            }
          }
        }
      }
      for (let i = 0; i < updateChildProductIndexData.length; i++) {
        let indexCount = data.indexCount + "." + (i + 1);
        calcFrpProductFromTree(
          updateChildProductIndexData[i],
          updateChildProductIndexData[i].id,
          indexCount,
          updateIndexTree.id
        );
      }
      async function calcFrpProductFromTree(
        node,
        parentNodeId,
        indexCount,
        id
      ) {
        if (node.id == parentNodeId) {
          node.indexCount = indexCount;
          await productTreeStructure.findByIdAndUpdate(id, {
            treeStructure: productIndexTreeStructure,
          });
        }
        if (node.children != null) {
          for (let i = 0; i < node.children.length; i++) {
            let childIndex = indexCount + "." + (i + 1);
            findIndexChildNodeFromTree(
              node.children[i],
              node.children[i].id,
              childIndex,
              id
            );
          }
        }

        async function findIndexChildNodeFromTree(
          node,
          nodeId,
          childIndex,
          id
        ) {
          if (node.id == nodeId) {
            node.indexCount = childIndex;
            await productTreeStructure.findByIdAndUpdate(id, {
              treeStructure: productIndexTreeStructure,
            });
          }
          if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
              let childIndex = childIndex + "." + (i + 1);
              findIndexChildNodeFromTree(
                node.children[i],
                node.children[i].id,
                childIndex,
                id
              );
            }
          }
        }
      }
    }

    // delete parent product

    let deleteTree = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });
    const deleteTreeStructure = deleteTree?.treeStructure;

    if (deleteTreeStructure.status === "inactive") {
      const deleteParent = await productTreeStructure.findByIdAndDelete(
        deleteTree._id
      );
    }

    let existTree = await productTreeStructure.findOne({
      _id: data.productTreeStructureId,
    });

    res.status(201).json({
      message: "Product Deleted Successfuly",
      data: {
        existTree,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllProduct(req, res, next) {
  try {
    const getAllProductDetails = await product
      .find()
      .populate("companyId")
      .populate("projectId");

    res.status(201).json({
      message: "Get All Product Details Successfully ",
      data: {
        getAllProductDetails,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const productId = req.params.id;

    const getProductDetails = await product
      .findOne({ _id: productId })
      .populate("companyId")
      .populate("projectId");

    res.status(201).json({
      message: "Get Product Details Successfully",
      data: {
        getProductDetails,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function parentProductCopyPaste(req, res, next) {
  try {
    const data = req.body;
    const copyProductId = data.copyProductTreeId;
    const pasteProductId = data.pasteProductTreeId;

    const existCopyTree = await productTreeStructure.findOne({
      _id: copyProductId,
    });
    const existPasteTree = await productTreeStructure.findOne({
      _id: pasteProductId,
    });

    const copyTreeStructure = existCopyTree?.treeStructure;
    const pasteTreeStructure = existPasteTree?.treeStructure;
    const indexCount = pasteTreeStructure.indexCount;

    let treeArr = [];
    let copyTreeProduct = [];
    checkNodeIntoTree(copyTreeStructure);
    async function checkNodeIntoTree(node) {
      if (node.status === "active") {
        treeArr.push(node);
      }
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          checkNodeIntoTree(node.children[i]);
        }
      }
    }

    treeArr.map((treeData) => {
      if (treeData.id == data.copyProductId) {
        copyTreeProduct.push(treeData);
      }
    });

    const productData = {
      projectId: existPasteTree.projectId,
      companyId: existPasteTree.companyId,
      productName: copyTreeProduct[0].productName,
      category: copyTreeProduct[0].category,
      reference: copyTreeProduct[0].reference,
      partType: copyTreeProduct[0].partType,
      partNumber: copyTreeProduct[0].partNumber,
      quantity: copyTreeProduct[0].quantity,
      environment: copyTreeProduct[0].environment,
      temperature: copyTreeProduct[0].temperature,
      status: copyTreeProduct[0].status,
    };
    if (pasteTreeStructure.category === "Assembly") {
      const createData = await product.create(productData);
      const childrenTreeLength =
        pasteTreeStructure.children.length == 0
          ? +1
          : pasteTreeStructure.children.length + 1;
      const createNode = {
        id: mongoose.Types.ObjectId(createData._id),
        indexCount: `${indexCount}.${childrenTreeLength}`,
        productId: pasteTreeStructure.id,
        productName: copyTreeProduct[0].productName,
        category: copyTreeProduct[0].category,
        reference: copyTreeProduct[0].reference,
        partType: copyTreeProduct[0].partType,
        partNumber: copyTreeProduct[0].partNumber,
        quantity: copyTreeProduct[0].quantity,
        environment: copyTreeProduct[0].environment,
        temperature: copyTreeProduct[0].temperature,
        status: copyTreeProduct[0].status,
        parentId: pasteProductId,
        fr: "",
        mttr: "",
        mct: "",
        mlh: "",
        children: [],
      };

      pasteTreeStructure.children.push(createNode);

      await productTreeStructure.findByIdAndUpdate(existPasteTree._id, {
        treeStructure: pasteTreeStructure,
      });

      res.status(201).json({
        message: "Product pasted successfully",
      });
    } else {
      res.status(400).json({
        message: `Sub-Product Not Allowed In ${pasteTreeStructure.category}`,
      });
    }
  } catch (error) {
    next(error);
  }
}
export async function subProductCopyPaste(req, res, next) {
  try {
    const data = req.body;
    const copyProductId = data.copyProductTreeId;
    const pasteProductTreeId = data.pasteProductTreeId;
    const pasteProductId = data.pasteProductId;

    const getPasteProductData = await productTreeStructure.findOne({
      _id: pasteProductTreeId,
    });
    const getCopyProductData = await productTreeStructure.findOne({
      _id: copyProductId,
    });

    function collectElements(data, result = [], parentIndex = "") {
      const currentIndex = data.indexCount;
      const newProduct = {
        ...data,
        indexCount: `${currentIndex}`,
      };
      result.push(newProduct);

      if (data.children && data.children.length > 0) {
        for (const child of data.children) {
          collectElements(child, result, `.${currentIndex}`);
        }
      }
      return result;
    }

    const pasteProductArr = collectElements(getPasteProductData.treeStructure);
    const foundProductIndex = pasteProductArr.findIndex(
      (pList) => pList.id == pasteProductId
    );
    const targetProduct = pasteProductArr[foundProductIndex];

    function collectCopyElements(data, parentIndex = "") {
      const currentIndex = data.indexCount;
      const newProduct = {
        ...data,
        indexCount: `${parentIndex}.${currentIndex}`,
      };
      if (data.children && data.children.length > 0) {
        newProduct.children = [];
        for (const child of data.children) {
          newProduct.children.push(
            collectCopyElements(child, `${parentIndex}.${currentIndex}`)
          );
        }
      }
      return newProduct;
    }

    function generateNewIds(node) {
      const uuid = uuidv4().replace(/-/g, "");
      const proId = uuid.substring(0, 24); // Extract 24 characters

      if (proId.length === 24) {
        node.id = mongoose.Types.ObjectId(proId);
      } else {
        console.error(
          "Invalid ObjectId: The substring doesn't contain 24 characters."
        );
      }

      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          generateNewIds(child);
        }
      }
    }
    const copiedElements = collectCopyElements(
      getCopyProductData.treeStructure
    );
    if (!targetProduct.children) {
      targetProduct.children = [];
    }
    generateNewIds(copiedElements);
    targetProduct.children.push(copiedElements);
    pasteProductArr[foundProductIndex] = targetProduct;
    const pasteIndexCount = pasteProductArr[0].indexCount;
    updateNodeIntoTree(pasteProductArr[0], pasteIndexCount);
    async function updateNodeIntoTree(node, nodeIndex) {
      if (node) {
        node.indexCount = nodeIndex;
        if (node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            findNodeFromTree(node.children[i], node.indexCount, i + 1, node.id);
          }
        } else {
          findNodeFromTree(node, node.indexCount, i + 1, node.id);
        }
      }
    }

    async function findNodeFromTree(node, nodeIndex, i, productId) {
      node.indexCount = nodeIndex;
      if (node.status === "active") {
        if (i !== undefined) {
          let sample = `${nodeIndex}.${i}`;
          node.indexCount = sample;
          node.productId = productId;
          node.parentId = pasteProductTreeId;
          await productTreeStructure.findByIdAndUpdate(
            getPasteProductData._id,
            {
              treeStructure: getPasteProductData.treeStructure,
            }
          );
          if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
              findNodeFromTree1(node.children[i], sample, i + 1, node.id);
            }
          }
        }
      }
    }
    async function findNodeFromTree1(node, nodeIndex, i, productId) {
      node.indexCount = nodeIndex;
      if (node.status === "active") {
        if (i !== undefined) {
          let sample = `${nodeIndex}.${i}`;
          node.indexCount = sample;
          node.productId = productId;
          node.parentId = pasteProductTreeId;
          await productTreeStructure.findByIdAndUpdate(
            getPasteProductData._id,
            {
              treeStructure: getPasteProductData.treeStructure,
            }
          );

          if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
              findNodeFromTree1(node.children[i], sample, i + 1, node.id);
            }
          }
        }
      }
    }

    res.status(201).json({
      message: "Copy and Paste Product Successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
}

export async function getSinglePbsTreeProduct(req, res, next) {
  try {
    const data = req.query;
    const getTreeProductData = await productTreeStructure.findOne({
      _id: data.copyProductTreeId,
    });
    const treeData = getTreeProductData.treeStructure;
    let treeArr = [];
    checkNodeIntoTree(treeData);
    async function checkNodeIntoTree(node) {
      if (node.status === "active") {
        treeArr.push(node);
      }
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          checkNodeIntoTree(node.children[i]);
        }
      }
    }

    treeArr.map((treeData) => {
      if (treeData.id == data.copyProductId) {
        res.status(200).json({
          message: "Get PBS Product Tree Data",
          treeData,
        });
      }
    });
  } catch (err) {
    next(err);
  }
}
