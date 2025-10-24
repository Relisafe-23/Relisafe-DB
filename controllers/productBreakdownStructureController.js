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
    const data = req.body;

    let parentStack = []; // Stack to keep track of parent nodes

    for (const productData of rowData) {
      const {
        indexCount,
        productName,
        category,
        partType,
        partNumber,
        fr,
        mttr,
        mct,
        mlh,
        reference,
        quantity,
        environment,
        temperature,
      } = productData;

      // Ensure indexCount is a string for comparison
      const indexCountString = String(indexCount); // Convert to string

      // Check if the product is a parent (indexCount without a dot) or child
      if (!indexCountString.includes(".")) {
        // Create the parent product
        const createdParentProduct = await product.create({
          projectId,
          companyId,
          productName,
          category,
          reference,
          partType,
          partNumber,
          quantity,
          environment,
          temperature,
          status: ACTIVE_TREE, // Default status
        });

        // Create the tree structure node for the parent product
        const parentNode = {
          id: createdParentProduct._id,
          indexCount: indexCountString,
          type: "Product",
          productName,
          category,
          reference,
          partType,
          partNumber,
          quantity,
          environment,
          temperature,
          status: ACTIVE_TREE,
          parentId: null, // No parent for top-level products
          fr,
          mttr,
          mct,
          mlh,
          children: [],
        };
        console.log("parentNode....",parentNode)
        // Create a new tree structure for the parent product
        const parentTreeStructure = await productTreeStructure.create({
          projectId,
          companyId,
          productId: createdParentProduct._id,
          treeStructure: parentNode,
        
        });
          console.log("parentTreeStructure....",parentTreeStructure)

        // Push the newly created parent node onto the stack
        parentStack.push({
          id: parentTreeStructure._id,
          indexCount: indexCountString,
          treeStructureId: parentTreeStructure.treeStructure._id
            ? parentTreeStructure.treeStructure._id
            : parentTreeStructure.treeStructure.id,
        });

        await productTreeStructure.findByIdAndUpdate(
          parentTreeStructure._id,
          { "treeStructure.parentId": parentTreeStructure.id }, // Set parentId to its own ID
          { new: true, runValidators: true }
        );
      } else {
      
        // This is a child product, determine the correct parent from the stack
        const parentIndexCount = indexCountString.slice(
          0,
          indexCountString.indexOf(".")
        );
        console.log("esle....",parentIndexCount)

        // Find the parent node using the parentIndexCount
        const parentNode = parentStack.find(
          (node) => node.indexCount == parentIndexCount
        );
        

        if (parentNode) {
          // Create the child product
          const createdChildProduct = await product.create({
            projectId,
            companyId,
            productName,
            category,
            reference,
            partType,
            partNumber,
            quantity,
            environment,
            temperature,
            status: ACTIVE_TREE, // Default status
          });

          // Create the tree structure node for the child product
          const childNode = {
            id: createdChildProduct._id,
            // productId: parentNode.treeStructureId,
            indexCount: indexCountString,
            type: "Product",
            productName,
            category,
            reference,
            partType,
            partNumber,
            quantity,
            environment,
            temperature,
            status: ACTIVE_TREE,
            parentId: parentNode.id.toString(), // Link child to the correct parent
            fr,
            mttr,
            mct,
            mlh,
            children: [],
          };

          // Add the child node to the parent's children array
          await productTreeStructure.findByIdAndUpdate(parentNode.id, {
            $push: { "treeStructure.children": childNode },
          });

          // Update the parent node's productId to include the child's ID
          // await productTreeStructure.findByIdAndUpdate(parentNode.id, {
          //   $set: { "treeStructure.productId": createdChildProduct._id },
          // });
        } else {
          console.error(
            `Parent not found for child indexCount: ${indexCountString}`
          );
        }

        const getTreeData = await productTreeStructure.find({
          projectId: data.projectId,
          companyId: data.companyId,
        }); 
        if(getTreeData.length > 1){
          getTreeData.map((treeData) => {
            updateParentProductIdforEach(treeData);
          });
  
          // Function to iterate over treeStructure and update child productIds
          async function updateParentProductIdforEach(treeData) {
            // Ensure treeStructure exists and has children
            if (treeData.treeStructure && Array.isArray(treeData.treeStructure.children)) {
              treeData.treeStructure.children.map((cList) => {
                updateCalc(cList, treeData.treeStructure.id, treeData);
              });
            } else {
              console.error("Invalid treeStructure or children not found for:", treeData._id);
            }
          }
          async function updateCalc(node, parentId, treeData) {
            if (node) {
              // Update productId with parentId
              node.productId = parentId;
          
              // Update the tree structure in MongoDB
              await productTreeStructure.findByIdAndUpdate(
                treeData._id,
                {
                  $set: {
                    "treeStructure.children.$[elem].productId": parentId,
                  },
                },
                {
                  arrayFilters: [{ "elem.id": node.id }],
                  new: true,
                  runValidators: true,
                }
              );
          
              // Only recurse if there are further children
              if (Array.isArray(node.children) && node.children.length > 0) {
                for (let child of node.children) {
                  // Use iteration instead of recursion for deeper levels to avoid stack overflow
                  await updateCalc(child, node.id, treeData);
                }
              }
            }
          }
        } 
        else{
            updateParentProductIdforEach(getTreeData[0]?.treeStructure);
         
  
          // Function to iterate over treeStructure and update child productIds
          async function updateParentProductIdforEach(treeData) { 
           // console.log("treeData.......",treeData)           
          
            if(treeData.children.length > 0){
              treeData.children.map((cList) => {
               // console.log("cList......",cList)
                updateCalc(cList, treeData.id);
              });
            }
          }
          async function updateCalc(node, parentId) {
            // console.log("node......",node);
            // console.log("parentId......",parentId);
            if (node) {
              // Update productId with parentId
              node.productId = parentId;
          
              // Update the tree structure in MongoDB
              await productTreeStructure.findByIdAndUpdate(
                getTreeData[0]._id,
                {
                  $set: {
                    "treeStructure.children.$[elem].productId": parentId,
                  },
                },
                {
                  arrayFilters: [{ "elem.id": node.id }],
                  new: true,
                  runValidators: true,
                }
              );                        
            }
            if (node.children.length > 0) {
              for (let child of node.children) {
                //console.log("child......",child)
                // Use iteration instead of recursion for deeper levels to avoid stack overflow
                await updateParentProductIdforEach(child);
              }
            }
          }
        }      
       
      }
    }

    res.status(201).json({
      message: "Products and child products created successfully",
    });
  } catch (error) {
    console.error("Error creating products and tree structure: ", error);
    next(error);
  }
}
