import ElementParameterData from "../models/ElementParameterModal.js"
import mongoose from "mongoose";

// export const createElementParameter = async (req, res) => {
//   const data = req.body;

//   console.log(data?.idforApi ,": idforApi ")
//   const elementParameters = await ElementParameterData.create({
//     indexCount: data.indexCount,
//     partNumber: data.partNumber,
//     productName: data.productName,
//     rbdId: data.rbdId,
//     fr: data.fr,
//     // blockId:data.blockId,
//     productId: data.productId,
//     fmecaId: data.fmecaId,
//     fmDescription: data.fmDescription,
//     elementType: data.elementType,
//     time: data.time,
//     repair: data.repair,
//     inspectionPeriod: data.inspectionPeriod,
//     dutyCycle: data.dutyCycle,
//     color: data.color,
//     frDistribution: data.frDistribution,
//     k: data.k,
//     n: data.n,
//     repairDistribution: data.repairDistribution,
//     load: data.load,
//     mct: data.mct,
//     projectId: data.projectId,
//     companyId: data.companyId,
//     type: data.blockType || data.type || "Regular",
//   });
//   res.status(201).json({
//     success: true,
//     data: elementParameters
//   });

// }

// export const createElementParameter = async (req, res) => {
//   try {
//     const data = req.body;
//     const idforApi = data?.idforApi;

//     console.log(idforApi, ": idforApi");

//     // If idforApi exists, push a new block to the branch
//     if (idforApi) {
//       const { ItemId, branchId, branchIndex, location } = idforApi;

//       console.log(location);

//       // First, get the current branch to determine block positions
//       const parentDocument = await ElementParameterData.findById(ItemId);

//       if (!parentDocument) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent document not found"
//         });
//       }

//       // Find the specific branch
//       const branch = parentDocument.branches.find(b => b._id.toString() === branchId);

//       if (!branch) {
//         return res.status(404).json({
//           success: false,
//           message: "Branch not found"
//         });
//       }

//       const currentBlocks = branch.blocks || [];

//       // Create new block object
//       const newBlock = {
//         _id: new mongoose.Types.ObjectId(),
//         blockId: data.blockId || Date.now(),
//         name: data.productName || data.blockType || "New Block",
//         type: data.blockType || data.type || "Regular",
//         fr: data.fr || 0.001,
//         mtbf: data.mtbf || (data.fr ? 1000 / data.fr : 1000),
//         reliabilityData: {
//           partNumber: data.partNumber,
//           productId: data.productId,
//           fmecaId: data.fmecaId,
//           fmDescription: data.fmDescription,
//           time: data.time,
//           repair: data.repair,
//           inspectionPeriod: data.inspectionPeriod,
//           dutyCycle: data.dutyCycle,
//           color: data.color,
//           frDistribution: data.frDistribution,
//           repairDistribution: data.repairDistribution,
//           load: data.load,
//           mct: data.mct,
//           elementType: data.elementType,
//           indexCount: data.indexCount,
//           k: data.k,
//           n: data.n
//         }
//       };

//       let updatedRBD;

//       // Check location to determine where to insert
//       if (location && location.includes('left')) {
//         // Insert at the beginning (before existing blocks)
//         updatedRBD = await ElementParameterData.findOneAndUpdate(
//           {
//             "_id": ItemId,
//             "branches._id": branchId
//           },
//           {
//             "$push": {
//               "branches.$.blocks": {
//                 "$each": [newBlock],
//                 "$position": 0 // This adds the block at the beginning
//               }
//             }
//           },
//           { new: true }
//         );

//         // After insertion, update all block indices to maintain order
//         if (updatedRBD) {
//           const updatedBranch = updatedRBD.branches.find(b => b._id.toString() === branchId);
//           if (updatedBranch) {
//             // Reindex blocks starting from 0
//             const updateIndexPromises = updatedBranch.blocks.map((block, idx) => {
//               return ElementParameterData.updateOne(
//                 {
//                   "_id": ItemId,
//                   "branches._id": branchId,
//                   "branches.blocks._id": block._id
//                 },
//                 {
//                   "$set": {
//                     "branches.$[branch].blocks.$[block].index": idx
//                   }
//                 },
//                 {
//                   "arrayFilters": [
//                     { "branch._id": branchId },
//                     { "block._id": block._id }
//                   ]
//                 }
//               );
//             });

//             await Promise.all(updateIndexPromises);

//             // Fetch the updated document again
//             updatedRBD = await ElementParameterData.findById(ItemId);
//           }
//         }

//         console.log("Block added at the beginning (left side)");
//       } else {
//         // Default: Add at the end (right side)
//         // Calculate the next block index
//         const nextBlockIndex = currentBlocks.length > 0
//           ? Math.max(...currentBlocks.map(b => b.index)) + 1
//           : 0;

//         newBlock.index = nextBlockIndex;

//         updatedRBD = await ElementParameterData.findOneAndUpdate(
//           {
//             "_id": ItemId,
//             "branches._id": branchId
//           },
//           {
//             "$push": {
//               "branches.$.blocks": newBlock
//             }
//           },
//           { new: true }
//         );

//         console.log("Block added at the end (right side)");
//       }

//       if (updatedRBD) {
//         return res.status(200).json({
//           success: true,
//           message: location && location.includes('left')
//             ? "New block added at the beginning of branch"
//             : "New block added at the end of branch",
//           data: updatedRBD,
//           newBlock: newBlock,
//           position: location && location.includes('left') ? 'left' : 'right'
//         });
//       } else {
//         console.log("Failed to add block to branch, creating separate element parameter");
//       }
//     }

//     // If no idforApi or update failed, create separate ElementParameterData
//     const elementParameters = await ElementParameterData.create({
//       indexCount: data.indexCount,
//       partNumber: data.partNumber,
//       productName: data.productName,
//       rbdId: data.rbdId,
//       fr: data.fr,
//       blockId: data.blockId,
//       productId: data.productId,
//       fmecaId: data.fmecaId,
//       fmDescription: data.fmDescription,
//       elementType: data.elementType,
//       time: data.time,
//       repair: data.repair,
//       inspectionPeriod: data.inspectionPeriod,
//       dutyCycle: data.dutyCycle,
//       color: data.color,
//       frDistribution: data.frDistribution,
//       k: data.k,
//       n: data.n,
//       repairDistribution: data.repairDistribution,
//       load: data.load,
//       mct: data.mct,
//       projectId: data.projectId,
//       companyId: data.companyId,
//       type: data.blockType || data.type || "Regular",
//     });

//     res.status(201).json({
//       success: true,
//       data: elementParameters
//     });

//   } catch (error) {
//     console.error("Error in createElementParameter:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

export const createElementParameter = async (req, res) => {

  console.log(req.body, 'from parallel inside')

  try {
    const data = req.body;
    const idforApi = data?.idforApi;
    const targetId = data?.targetId;
    // ─── CASE 1: idforApi exists — insert into branch by ItemId ──────────────
    if (idforApi) {
      const { ItemId, branchId, branchIndex, location, nested } = idforApi;

      const parentDocument = await ElementParameterData.findById(ItemId);
      if (!parentDocument) {

        const newElement = await ElementParameterData.create({
          indexCount: data.indexCount,
          partNumber: data.partNumber,
          productName: data.productName,
          rbdId: data.rbdId,
          fr: data.fr,
          blockId: data.blockId || Date.now(),
          productId: data.productId,
          fmecaId: data.fmecaId,
          fmDescription: data.fmDescription,
          elementType: data.elementType,
          time: data.time,
          repair: data.repair,
          inspectionPeriod: data.inspectionPeriod,
          dutyCycle: data.dutyCycle,
          color: data.color,
          frDistribution: data.frDistribution,
          k: data.k,
          n: data.n,
          repairDistribution: data.repairDistribution,
          load: data.load,
          mct: data.mct,
          mttr:data.mttr,
          mtbf:data.mtbf,
          reliability:data.reliability,
          unavailability:data.unavailability,
          projectId: data.projectId,
          companyId: data.companyId,
          type: data.blockType || data.type || "Regular",
        });

        return res.status(201).json({
          success: true,
          message: "Standalone element created (no parent)",
          data: newElement
        });
      }

      const findBranchRecursively = (branches, targetBranchId) => {
        for (let i = 0; i < branches.length; i++) {
          const branch = branches[i];
          if (branch._id.toString() === targetBranchId) {
            return { branch, parentPath: [], branchIndex: i };
          }
          if (branch.blocks && branch.blocks.length > 0) {
            for (let j = 0; j < branch.blocks.length; j++) {
              const block = branch.blocks[j];
              if (
                (block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
                block.branches?.length > 0
              ) {
                const result = findBranchRecursively(block.branches, targetBranchId);
                if (result) {
                  return {
                    branch: result.branch,
                    parentPath: [{ branchIndex: i, blockIndex: j, blockId: block._id }, ...result.parentPath],
                    branchIndex: result.branchIndex
                  };
                }
              }
            }
          }
        }
        return null;
      };

      let targetBranch = null;
      let parentPath = [];

      targetBranch = parentDocument.branches.find(b => b._id.toString() === branchId);

      if (!targetBranch && nested) {
        const result = findBranchRecursively(parentDocument.branches, branchId);
        if (result) {
          targetBranch = result.branch;
          parentPath = result.parentPath;
        }
      }

      if (!targetBranch) {
        return res.status(404).json({ success: false, message: `Branch not found with id: ${branchId}` });
      }

      const currentBlocks = targetBranch.blocks || [];

      // Determine insert position
      let insertPosition = null;
      if (targetId) {
        const targetIndex = currentBlocks.findIndex(b => b._id.toString() === targetId.toString());
        if (targetIndex !== -1) {
          insertPosition = targetIndex + 1;
        }
      }
      if (location && location.includes('left')) {
        insertPosition = 0;
      }

      const newBlock = {
        name: data.name,
        k: data.k,
        n: data.n,
        lambda: data.lambda,
        reliability: data.reliability,
        unavailability: data.unavailability,
        mu: data.mu,
        mttr: data.mttr,
        productId: data.productId,
        components: data.components || [],
        // productId: "692013b2dc0b1e4b0c9a3d44",
        indexCount: data.indexCount,
        partNumber: data.partNumber,
        productName: data.productName,
        rbdId: data.rbdId,
        fr: data.fr,
        // blockId:data.blockId,
        productId: data.productId,
        fmecaId: data.fmecaId,
        fmDescription: data.fmDescription,
        elementType: data.elementType,
        time: data.time,
        repair: data.repair,
        inspectionPeriod: data.inspectionPeriod,
        dutyCycle: data.dutyCycle,
        color: data.color,
        frDistribution: data.frDistribution,
        k: data.k,
        n: data.n,
        repairDistribution: data.repairDistribution,
        load: data.load,
        mct: data.mct,
        projectId: data.projectId,
        companyId: data.companyId,
        type: data.blockType || data.type || "Regular" || "K-out-of-N",
        kOfNType: data.kOfNType || data.selectedLabel || 'Identical',
        // Save components for non-identical
        components: data.components || [],
        _id: new mongoose.Types.ObjectId(),
        index: insertPosition !== null ? insertPosition : currentBlocks.length,
        blockId: data.blockId || Date.now(),
        name: data.productName || data.blockType || "New Block",
        type: data.blockType || data.type || "Regular",
        elementType: data.elementType || data.type || "Regular",
        fr: data.fr || '',
        mtbf: data.mtbf,
        time: data.time,
        repair: data.repair,
        inspectionPeriod: data.inspectionPeriod,
        dutyCycle: data.dutyCycle,
        color: data.color,
        frDistribution: data.frDistribution,
        repairDistribution: data.repairDistribution,
        load: data.load,
        mct: data.mct,
        mttr: data.mttr,
        reliability: data.reliability,
        unavailability: data.unavailability,
        partNumber: data.partNumber,
        productName: data.productName,
        fmecaId: data.fmecaId,
        fmDescription: data.fmDescription,
        reliabilityData: {
          partNumber: data.partNumber,
          productId: data.productId,
          fmecaId: data.fmecaId,
          fmDescription: data.fmDescription,
          time: data.time,
          repair: data.repair,
          inspectionPeriod: data.inspectionPeriod,
          dutyCycle: data.dutyCycle,
          color: data.color,
          frDistribution: data.frDistribution,
          repairDistribution: data.repairDistribution,
          load: data.load,
          mct: data.mct,
          elementType: data.elementType,
          indexCount: data.indexCount,
          k: data.k,
          n: data.n
        }
      };

      let updatedRBD;
      if (parentPath.length > 0) {
        // Nested branch
        let pathString = "branches";
        let arrayFilters = [];

        for (let idx = 0; idx < parentPath.length; idx++) {
          const seg = parentPath[idx];
          pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
          arrayFilters.push({ [`branch${idx}._id`]: parentDocument.branches[seg.branchIndex]._id });
          arrayFilters.push({ [`block${idx}._id`]: seg.blockId });
        }

        pathString += `.$[targetBranch].blocks`;
        arrayFilters.push({ "targetBranch._id": branchId });

        updatedRBD = await ElementParameterData.findOneAndUpdate(
          { "_id": ItemId },
          {
            "$push": {
              [pathString]: {
                "$each": [newBlock],
                ...(insertPosition !== null ? { "$position": insertPosition } : {})
              }
            }
          },
          { arrayFilters, new: true }
        );

      } else {
        // Top-level branch

        updatedRBD = await ElementParameterData.findOneAndUpdate(
          { "_id": ItemId, "branches._id": branchId },
          {
            "$push": {
              "branches.$.blocks": {
                "$each": [newBlock],
                ...(insertPosition !== null ? { "$position": insertPosition } : {})
              }
            }
          },
          { new: true }
        );

        // Reindex after any positional insertion
        if (updatedRBD && insertPosition !== null) {
          const updatedBranch = updatedRBD.branches.find(b => b._id.toString() === branchId);
          if (updatedBranch) {
            const updateIndexPromises = updatedBranch.blocks.map((block, idx) =>
              ElementParameterData.updateOne(
                { "_id": ItemId, "branches._id": branchId, "branches.blocks._id": block._id },
                { "$set": { "branches.$[branch].blocks.$[block].index": idx } },
                { "arrayFilters": [{ "branch._id": branchId }, { "block._id": block._id }] }
              )
            );
            await Promise.all(updateIndexPromises);
            updatedRBD = await ElementParameterData.findById(ItemId);
          }
        }
      }

      if (updatedRBD) {
        return res.status(200).json({
          success: true,
          message: "New block added successfully",
          data: updatedRBD,
          newBlock
        });
      } else {
        throw new Error("Failed to add block to branch");
      }
    }

    // If no idforApi, create separate ElementParameterData
    // const elementParameters = await ElementParameterData.create({
    //   indexCount: data.indexCount,
    //   partNumber: data.partNumber,
    //   productName: data.productName,
    //   rbdId: data.rbdId,
    //   fr: data.fr,
    //   blockId: data.blockId,
    //   productId: data.productId,
    //   fmecaId: data.fmecaId,
    //   fmDescription: data.fmDescription,
    //   elementType: data.elementType,
    //   time: data.time,
    //   repair: data.repair,
    //   mtbf:data.mtbf,
    //   mttr: data.mttr,
    //   reliability: data.reliability,
    //   unavailability: data.unavailability,
    //   inspectionPeriod: data.inspectionPeriod,
    //   dutyCycle: data.dutyCycle,
    //   color: data.color,
    //   frDistribution: data.frDistribution,
    //   k: data.k,
    //   n: data.n,
    //   repairDistribution: data.repairDistribution,
    //   load: data.load,
    //   mct: data.mct,
    //   projectId: data.projectId,
    //   companyId: data.companyId,
    //   type: data.blockType || data.type || "Regular",
    // });

    //   console.log(parentDocument, 'parentDocument');


    //   if (!parentDocument) {
    //     return res.status(404).json({ success: false, message: "Parent document not found by rbdId" });
    //   }

    //   const findBranchContainingBlock = (nodes, targetId) => {

    //     console.log(nodes, 'nodes')

    //     const newBlock = {
    //       _id: new mongoose.Types.ObjectId(),
    //       index: insertPosition,
    //       blockId: data.blockId || Date.now(),
    //       name: data.productName || data.blockType || "New Block",
    //       type: data.blockType || data.type || "Regular",
    //       elementType: data.elementType || data.type || "Regular",
    //       fr: data.fr || 0.001,
    //       mtbf: data.mtbf || (data.fr ? 1000 / data.fr : 1000),
    //       time: data.time,
    //       repair: data.repair,
    //       inspectionPeriod: data.inspectionPeriod,
    //       dutyCycle: data.dutyCycle,
    //       color: data.color,
    //       frDistribution: data.frDistribution,
    //       repairDistribution: data.repairDistribution,
    //       load: data.load,
    //       mct: data.mct,
    //       partNumber: data.partNumber,
    //       productName: data.productName,
    //       fmecaId: data.fmecaId,
    //       fmDescription: data.fmDescription,
    //       reliabilityData: {
    //         partNumber: data.partNumber,
    //         productId: data.productId,
    //         fmecaId: data.fmecaId,
    //         fmDescription: data.fmDescription,
    //         time: data.time,
    //         repair: data.repair,
    //         inspectionPeriod: data.inspectionPeriod,
    //         dutyCycle: data.dutyCycle,
    //         color: data.color,
    //         frDistribution: data.frDistribution,
    //         repairDistribution: data.repairDistribution,
    //         load: data.load,
    //         mct: data.mct,
    //         elementType: data.elementType,
    //         indexCount: data.indexCount,
    //         k: data.k,
    //         n: data.n
    //       }
    //     };

    //     for (let i = 0; i < nodes.length; i++) {
    //       const node = nodes[i];

    //       if (node._id.toString() === targetId.toString()) {
    //         const newBlock = {
    //           _id: new mongoose.Types.ObjectId(),
    //           ...newBlock,
    //         };

    //         nodes.splice(i + 1, 0, newBlock);

    //         nodes.forEach((n, idx) => {
    //           n.index = idx;
    //         });

    //         return true;
    //       }

    //     }
    //     return null;
    //   };

    //   const found = findBranchContainingBlock(parentDocument, targetId);

    //   console.log(found, 'found');

    //   if (!found) {
    //     return res.status(404).json({ success: false, message: "Target block not found in any branch" });
    //   }

    //   const { branch: targetBranch, branchId: foundBranchId, blockIndex, parentPath } = found;
    //   const insertPosition = blockIndex + 1;

    //   const newBlock = {
    //     _id: new mongoose.Types.ObjectId(),
    //     index: insertPosition,
    //     blockId: data.blockId || Date.now(),
    //     name: data.productName || data.blockType || "New Block",
    //     type: data.blockType || data.type || "Regular",
    //     elementType: data.elementType || data.type || "Regular",
    //     fr: data.fr || 0.001,
    //     mtbf: data.mtbf || (data.fr ? 1000 / data.fr : 1000),
    //     time: data.time,
    //     repair: data.repair,
    //     inspectionPeriod: data.inspectionPeriod,
    //     dutyCycle: data.dutyCycle,
    //     color: data.color,
    //     frDistribution: data.frDistribution,
    //     repairDistribution: data.repairDistribution,
    //     load: data.load,
    //     mct: data.mct,
    //     partNumber: data.partNumber,
    //     productName: data.productName,
    //     fmecaId: data.fmecaId,
    //     fmDescription: data.fmDescription,
    //     reliabilityData: {
    //       partNumber: data.partNumber,
    //       productId: data.productId,
    //       fmecaId: data.fmecaId,
    //       fmDescription: data.fmDescription,
    //       time: data.time,
    //       repair: data.repair,
    //       inspectionPeriod: data.inspectionPeriod,
    //       dutyCycle: data.dutyCycle,
    //       color: data.color,
    //       frDistribution: data.frDistribution,
    //       repairDistribution: data.repairDistribution,
    //       load: data.load,
    //       mct: data.mct,
    //       elementType: data.elementType,
    //       indexCount: data.indexCount,
    //       k: data.k,
    //       n: data.n
    //     }
    //   };

    //   let updatedRBD;

    //   if (parentPath?.length > 0) {
    //     // Nested branch
    //     let pathString = "branches";
    //     let arrayFilters = [];

    //     for (let idx = 0; idx < parentPath.length; idx++) {
    //       const seg = parentPath[idx];
    //       pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
    //       arrayFilters.push({ [`branch${idx}._id`]: parentDocument.branches[seg.branchIndex]._id });
    //       arrayFilters.push({ [`block${idx}._id`]: seg.blockId });
    //     }

    //     pathString += `.$[targetBranch].blocks`;
    //     arrayFilters.push({ "targetBranch._id": foundBranchId });

    //     updatedRBD = await ElementParameterData.findOneAndUpdate(
    //       { rbdId: data.rbdId },
    //       {
    //         "$push": {
    //           [pathString]: {
    //             "$each": [newBlock],
    //             "$position": insertPosition
    //           }
    //         }
    //       },
    //       { arrayFilters, new: true }
    //     );

    //   } else {
    //     // Top-level branch
    //     updatedRBD = await ElementParameterData.findOneAndUpdate(
    //       { rbdId: data.rbdId, "branches._id": foundBranchId },
    //       {
    //         "$push": {
    //           "branches.$.blocks": {
    //             "$each": [newBlock],
    //             "$position": insertPosition
    //           }
    //         }
    //       },
    //       { new: true }
    //     );

    //     // Reindex after insertion
    //     if (updatedRBD) {
    //       const updatedBranch = updatedRBD.branches.find(b => b._id.toString() === foundBranchId);
    //       if (updatedBranch) {
    //         const updateIndexPromises = updatedBranch.blocks.map((block, idx) =>
    //           ElementParameterData.updateOne(
    //             { rbdId: data.rbdId, "branches._id": foundBranchId, "branches.blocks._id": block._id },
    //             { "$set": { "branches.$[branch].blocks.$[block].index": idx } },
    //             { "arrayFilters": [{ "branch._id": foundBranchId }, { "block._id": block._id }] }
    //           )
    //         );
    //         await Promise.all(updateIndexPromises);
    //         updatedRBD = await ElementParameterData.findOne({ rbdId: data.rbdId });
    //       }
    //     }
    //   }

    //   if (updatedRBD) {
    //     return res.status(200).json({
    //       success: true,
    //       message: "New block inserted after target successfully",
    //       data: updatedRBD,
    //       newBlock
    //     });
    //   } else {
    //     throw new Error("Failed to insert block after target");
    //   }
    // }

    // // ─── CASE 3: no idforApi, no targetId — create standalone document ────────
    // const elementParameters = await ElementParameterData.create({
    //   indexCount: data.indexCount,
    //   partNumber: data.partNumber,
    //   productName: data.productName,
    //   rbdId: data.rbdId,
    //   fr: data.fr,
    //   blockId: data.blockId,
    //   productId: data.productId,
    //   fmecaId: data.fmecaId,
    //   fmDescription: data.fmDescription,
    //   elementType: data.elementType,
    //   time: data.time,
    //   repair: data.repair,
    //   inspectionPeriod: data.inspectionPeriod,
    //   dutyCycle: data.dutyCycle,
    //   color: data.color,
    //   frDistribution: data.frDistribution,
    //   k: data.k,
    //   n: data.n,
    //   repairDistribution: data.repairDistribution,
    //   load: data.load,
    //   mct: data.mct,
    //   projectId: data.projectId,
    //   companyId: data.companyId,
    //   type: data.blockType || data.type || "Regular",
    // });


    // below is working code 

    // const docs = await ElementParameterData.find({ rbdId: data.rbdId });

    // let arr = docs.map(doc => doc.toObject());

    // // Insert logic
    // if (!targetId) {
    //   arr.push({
    //     ...data,
    //     _id: new mongoose.Types.ObjectId()
    //   });
    // } else {
    //   const targetIndex = arr.findIndex(
    //     d => d._id.toString() === targetId.toString()
    //   );

    //   if (targetIndex === -1) {
    //     return res.status(404).json({ message: "Target not found" });
    //   }

    //   arr.splice(targetIndex + 1, 0, {
    //     ...data,
    //     _id: new mongoose.Types.ObjectId()
    //   });
    // }

    // // Save back
    // await ElementParameterData.deleteMany({ rbdId: data.rbdId });
    // await ElementParameterData.insertMany(arr);

    // return res.status(201).json({
    //   success: true,
    //   data: arr
    // });

    const docs = await ElementParameterData.find({ rbdId: data.rbdId });

    // console.log(docs,'docs')

    let arr = docs.map(doc => doc.toObject());

    // console.log(arr, 'arr')
    // console.log(targetId, 'arr')


    // if (arr.length === 0) {
    //   const newDoc = {
    //     ...data,
    //     _id: new mongoose.Types.ObjectId()
    //   };

    //   await ElementParameterData.create(newDoc);

    //   return res.status(201).json({
    //     success: true,
    //     message: "First element created",
    //     data: [newDoc]
    //   });
    // }

    // if (!targetId) {
    //   arr.push({
    //     ...data,
    //     _id: new mongoose.Types.ObjectId()
    //   });
    // } else {
    //   // const targetIndex = arr.findIndex(
    //   //   d => d._id.toString() === targetId.toString()
    //   // );


    //   const targetIndex = arr.findIndex(d => {
    //     const docId = d._id?.toString?.() || String(d._id);
    //     const targetIdStr = targetId.toString();
    //     return docId === targetIdStr;
    //   });

    //   console.log('Searching for targetId:', targetId.toString());
    //   console.log('Available IDs:', arr.map(d => d._id?.toString?.() || String(d._id)));
    //   console.log('Target index:', targetIndex);

    //   if (targetIndex === -1) {
    //     return res.status(404).json({ message: "Target not found" });
    //   }

    //   arr.splice(targetIndex + 1, 0, {
    //     ...data,
    //     _id: new mongoose.Types.ObjectId()
    //   });
    // }

    // await ElementParameterData.deleteMany({ rbdId: data.rbdId });
    // await ElementParameterData.insertMany(arr);

    // return res.status(201).json({
    //   success: true,
    //   data: arr
    // });

    // console.log(arr, 'arr');
    console.log(targetId, 'arr target id');

    // Recursive function to find an element and its parent context
    const findNestedBlockContext = (items, targetId) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Check current item's _id
        if (item._id && item._id.toString() === targetId.toString()) {
          return {
            found: true,
            context: 'top-level',
            parentArray: items,
            index: i,
            item: item
          };
        }

        // Check if this is a Parallel Section with branches
        if ((item.type === 'Parallel Section' || item.elementType === 'Parallel Section') &&
          item.branches && Array.isArray(item.branches)) {

          for (let branchIdx = 0; branchIdx < item.branches.length; branchIdx++) {
            const branch = item.branches[branchIdx];

            if (branch.blocks && Array.isArray(branch.blocks)) {
              for (let blockIdx = 0; blockIdx < branch.blocks.length; blockIdx++) {
                const block = branch.blocks[blockIdx];

                // Check block's _id
                if (block._id && block._id.toString() === targetId.toString()) {
                  return {
                    found: true,
                    context: 'nested-in-branch',
                    parentSection: item,
                    branch: branch,
                    branchIndex: branchIdx,
                    blockIndex: blockIdx,
                    parentArray: branch.blocks,
                    index: blockIdx,
                    item: block
                  };
                }

                // If block is also a Parallel Section, search its nested branches
                if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
                  block.branches && Array.isArray(block.branches)) {

                  for (let nestedBranchIdx = 0; nestedBranchIdx < block.branches.length; nestedBranchIdx++) {
                    const nestedBranch = block.branches[nestedBranchIdx];

                    if (nestedBranch.blocks && Array.isArray(nestedBranch.blocks)) {
                      for (let nestedBlockIdx = 0; nestedBlockIdx < nestedBranch.blocks.length; nestedBlockIdx++) {
                        const nestedBlock = nestedBranch.blocks[nestedBlockIdx];

                        if (nestedBlock._id && nestedBlock._id.toString() === targetId.toString()) {
                          return {
                            found: true,
                            context: 'nested-in-nested-branch',
                            parentSection: block,
                            parentSectionIndex: i,
                            branch: nestedBranch,
                            branchIndex: nestedBranchIdx,
                            blockIndex: nestedBlockIdx,
                            parentArray: nestedBranch.blocks,
                            index: nestedBlockIdx,
                            item: nestedBlock
                          };
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return { found: false };
    };

    if (arr.length === 0) {
      const newDoc = {
        ...data,
        _id: new mongoose.Types.ObjectId()
      };

      await ElementParameterData.create(newDoc);

      return res.status(201).json({
        success: true,
        message: "First element created",
        data: [newDoc]
      });
    }

    if (!targetId) {
      // No target ID, push to top level
      arr.push({
        ...data,
        _id: new mongoose.Types.ObjectId()
      });
    } else {
      // Search for the target block in nested structure
      const searchResult = findNestedBlockContext(arr, targetId);

      console.log('Search result:', JSON.stringify(searchResult, null, 2));

      if (!searchResult.found) {
        return res.status(404).json({
          message: "Target not found",
          searchedId: targetId,
          availableTopLevelIds: arr.map(d => d._id?.toString?.() || String(d._id))
        });
      }

      // Create the new block
      const newBlock = {
        ...data,
        _id: new mongoose.Types.ObjectId(),
        isNested: true,  // Mark as nested
        type: data.type || 'Regular',
        elementType: data.elementType || 'Regular'
      };

      // Insert based on where the target was found
      if (searchResult.context === 'top-level') {
        // Insert at top level after the target
        arr.splice(searchResult.index + 1, 0, newBlock);
      }
      else if (searchResult.context === 'nested-in-branch') {
        // Insert in the same branch's blocks array, right after the target block
        searchResult.parentArray.splice(searchResult.index + 1, 0, newBlock);

        // Mark the parent section as modified
        const sectionIndex = arr.findIndex(s => s._id.toString() === searchResult.parentSection._id.toString());
        if (sectionIndex !== -1) {
          arr[sectionIndex] = searchResult.parentSection;
        }
      }
      else if (searchResult.context === 'nested-in-nested-branch') {
        // Insert in deeply nested branch's blocks array
        searchResult.parentArray.splice(searchResult.index + 1, 0, newBlock);

        // Update the parent section
        const sectionIndex = arr.findIndex(s => s._id.toString() === searchResult.parentSection._id.toString());
        if (sectionIndex !== -1) {
          arr[sectionIndex] = searchResult.parentSection;
        }
      }
    }

    // Save the entire structure
    await ElementParameterData.deleteMany({ rbdId: data.rbdId });
    await ElementParameterData.insertMany(arr);

    return res.status(201).json({
      success: true,
      data: arr
    });

  } catch (error) {
    console.error("Error in createElementParameter:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const updateelementParameters = async (req, res) => {
  const data = req.body
  const { id } = req.params

  console.log(data, 'data for edit')
  try {
    const elementParameters = await ElementParameterData.findByIdAndUpdate(
      // indexCount: data.indexCount,
      // partNumber: data.partNumber,
      // productName: data.productName,
      // fr: data.fr,
      // rbdId: data.rbdId,
      // productId: data.productId,
      // fmecaId: data.fmecaId,
      // fmDescription: data.fmDescription,
      // elementType: data.elementType,
      // time: data.time,
      // repair: data.repair,
      // inspectionPeriod: data.inspectionPeriod,
      // dutyCycle: data.dutyCycle,
      // color: data.color,
      // frDistribution: data.frDistribution,
      // k: data.k,
      // n: data.n,
      // repairDistribution: data.repairDistribution,
      // load: data.load,
      // mct: data.mct,
      // projectId: data.projectId,
      // companyId: data.companyId,
      id,
      data,
      { new: true }

    );

    if (!elementParameters) {
      console.log("Element parameter not found")
      return res.status(404).json({
        success: false,
        message: 'Element parameter not found'
      });
    }

    res.status(201).json({
      success: true,
      data: elementParameters
    });
  } catch (error) {
    console.log(error)
  }

}

export const updateNestedBlock = async (req, res) => {
  console.log(req.body, 'nested block update');
  console.log(req.params, 'req.params nested block update');

  try {
    const { parentId, blockId } = req.params;
    const updateData = req.body;

    // Find the parent parallel section
    const parentSection = await ElementParameterData.findById(parentId);

    if (!parentSection) {
      return res.status(404).json({
        success: false,
        message: 'Parent parallel section not found'
      });
    }

    let blockFound = false;
    let updatedBlockData = null;

    // Recursive function to find and update nested blocks
    const findAndUpdateBlock = (branches) => {
      if (!branches || !Array.isArray(branches)) return false;

      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];

        if (branch.blocks && Array.isArray(branch.blocks)) {
          for (let j = 0; j < branch.blocks.length; j++) {
            const block = branch.blocks[j];

            // Check if this is the block we want to update
            if (block._id.toString() === blockId) {
              // Update the block
              const updatedBlock = {
                ...block.toObject(),
                ...updateData,
                _id: block._id,
                type: updateData.type || 'Regular',
                elementType: updateData.elementType || 'Regular'
              };

              branch.blocks[j] = updatedBlock;
              updatedBlockData = updatedBlock;
              return true;
            }

            // If this block is a Parallel Section with nested branches, search inside it
            if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
              block.branches &&
              Array.isArray(block.branches)) {
              const found = findAndUpdateBlock(block.branches);
              if (found) return true;
            }
          }
        }
      }
      return false;
    };

    // Start recursive search from the parent section's branches
    blockFound = findAndUpdateBlock(parentSection.branches);

    if (!blockFound) {
      return res.status(404).json({
        success: false,
        message: 'Block not found in parallel section (checked nested sections as well)'
      });
    }

    // Save the updated parent document
    await parentSection.save();

    res.status(200).json({
      success: true,
      data: updatedBlockData,
      message: 'Nested block updated successfully'
    });

  } catch (error) {
    console.log('Error updating nested block:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating nested block',
      error: error.message
    });
  }
};

export const getElementParameterById = async (req, res) => {
  const { rbdId, projectId } = req.params
  const data = req.body;

  try {
    const elementParameter = await ElementParameterData.find({ projectId, rbdId });
    if (!elementParameter) {
      return res.status(404).json({
        success: false,
        message: "Element Parameter not found",
      });
    }
    res.status(200).json({
      success: true,
      data: elementParameter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const createParallelSection = async (req, res) => {

  const data = req.body;
  console.log(data, 'data from parallel branch')
  const { rbdId, projectId } = req.params;


  try {
    const {
      companyId,
      productId,
      name,
      arrangement,
      k,
      n,
      branches,
      data,
      isNested,
      parentId,
      targetId,
    } = req.body;

    // ── NESTED: add parallel section inside an existing branch ──────────────
    if (parentId && targetId) {
      const parentDocument = await ElementParameterData.findById(parentId);
      if (!parentDocument) {
        return res.status(404).json({ success: false, message: "Parent document not found" });
      }

      const findBranchById = (branches, targetBranchId, path = []) => {
        for (let i = 0; i < branches.length; i++) {
          const branch = branches[i];
          if (branch._id.toString() === targetBranchId) {
            return { found: true, containingBranch: branch, path };
          }
          if (branch.blocks) {
            for (let j = 0; j < branch.blocks.length; j++) {
              const block = branch.blocks[j];
              if (
                (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
                block.branches?.length > 0
              ) {
                const result = findBranchById(
                  block.branches,
                  targetBranchId,
                  [...path, { branchIndex: i, blockIndex: j }]
                );
                if (result.found) return result;
              }
            }
          }
        }
        return { found: false };
      };

      const findBranchContainingBlock = (branches, targetBlockId, path = []) => {
        for (let i = 0; i < branches.length; i++) {
          const branch = branches[i];
          if (branch.blocks && branch.blocks.length > 0) {
            const blockExists = branch.blocks.some(
              block => block._id.toString() === targetBlockId
            );
            if (blockExists) {
              return { found: true, containingBranch: branch, path };
            }
            for (let j = 0; j < branch.blocks.length; j++) {
              const block = branch.blocks[j];
              if (
                (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
                block.branches?.length > 0
              ) {
                const result = findBranchContainingBlock(
                  block.branches,
                  targetBlockId,
                  [...path, { branchIndex: i, blockIndex: j }]
                );
                if (result.found) return result;
              }
            }
          }
        }
        return { found: false };
      };

      let result = findBranchById(parentDocument.branches, targetId);
      if (!result.found) {
        result = findBranchContainingBlock(parentDocument.branches, targetId);
      }

      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: `No branch found for targetId: ${targetId}`
        });
      }

      const { containingBranch, path } = result;


      if (!branches || !Array.isArray(branches) || branches.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Branches data is required for parallel section"
        });
      }

      const formattedNestedBranches = branches.map((nestedBranch, branchIdx) => {
        let blocks = nestedBranch.blocks || [];
        if (typeof blocks === "string") {
          try { blocks = JSON.parse(blocks); } catch { blocks = []; }
        }

        // Filter out invalid/empty blocks
        const formattedBlocks = blocks
          .filter(block => block && (block.id || block.blockId || block._id))
          .map((block, blockIdx) => ({
            _id: new mongoose.Types.ObjectId(),
            index: blockIdx,
            blockId: block.id || block.blockId || Date.now() + blockIdx,
            name: block.name || `Block ${blockIdx + 1}`,
            type: block.type || "Regular",
            elementType: block.type || "Regular",
            fr: block.fr || block.failureRate ||'',
            mtbf: block.mtbf || '',
            ...(block.type === "Regular" && {
              partNumber: block.partNumber,
              productName: block.productName,
              fmecaId: block.fmecaId,
              fmDescription: block.fmDescription,
              time: block.time,
              repair: block.repair,
              mttr: block.mttr,
              reliability: block.reliability,
              unavailability: block.unavailability,
              inspectionPeriod: block.inspectionPeriod,
              dutyCycle: block.dutyCycle,
              color: block.color,
              frDistribution: block.frDistribution,
              repairDistribution: block.repairDistribution,
              load: block.load,
              mct: block.mct,
            }),
            reliabilityData: block.reliabilityData || null
          }));

        return {
          _id: new mongoose.Types.ObjectId(),
          index: branchIdx,
          name: nestedBranch.name || `Branch ${branchIdx + 1}`,
          blocks: formattedBlocks
        };
      });

      const newParallelBlock = {
        _id: new mongoose.Types.ObjectId(),
        index: containingBranch.blocks.length,
        blockId: req.body.blockId || Date.now(),
        name: name || "Parallel Section",
        type: "Parallel Section",
        elementType: "Parallel Section",
        fr: null,
        mtbf: null,
        arrangement: arrangement || "horizontal",
        k: k || 1,
        n: n || branches.length,
        branches: formattedNestedBranches,
        isNested: true,
        parentBranchId: containingBranch._id,
        parentSectionId: parentId,
        reliabilityData: {
          elementType: "Parallel Section",
          isNestedParallel: true,
          arrangement: arrangement || "horizontal",
          k: k || 1,
          n: n || branches.length,
          parentBranchId: containingBranch._id,
          parentSectionId: parentId,
          branchCount: branches.length
        }
      };

      let pathString = "branches";
      let arrayFilters = [];
      let currentBranches = parentDocument.branches;

      for (let idx = 0; idx < path.length; idx++) {
        const seg = path[idx];
        const actualBranch = currentBranches[seg.branchIndex];
        const actualBlock = actualBranch.blocks[seg.blockIndex];

        pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
        arrayFilters.push({ [`branch${idx}._id`]: new mongoose.Types.ObjectId(actualBranch._id) });
        arrayFilters.push({ [`block${idx}._id`]: new mongoose.Types.ObjectId(actualBlock._id) });

        currentBranches = actualBlock.branches;
      }

      pathString += `.$[targetBranch].blocks`;
      arrayFilters.push({ "targetBranch._id": new mongoose.Types.ObjectId(containingBranch._id) });



      const updatedDocument = await ElementParameterData.findOneAndUpdate(
        { "_id": parentId },
        { "$push": { [pathString]: newParallelBlock } },
        { arrayFilters, new: true }
      );

      if (!updatedDocument) throw new Error("Failed to add parallel section");

      const findUpdatedBranch = (branches) => {
        for (const branch of branches) {
          if (branch._id.toString() === containingBranch._id.toString()) return branch;
          if (branch.blocks) {
            for (const block of branch.blocks) {
              if (
                (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
                block.branches
              ) {
                const found = findUpdatedBranch(block.branches);
                if (found) return found;
              }
            }
          }
        }
        return null;
      };

      const updatedBranch = findUpdatedBranch(updatedDocument.branches);

      if (updatedBranch?.blocks) {
        let reindexBasePath = "branches";
        let reindexBaseFilters = [];
        let reindexCurrentBranches = parentDocument.branches;

        for (let idx = 0; idx < path.length; idx++) {
          const seg = path[idx];
          const actualBranch = reindexCurrentBranches[seg.branchIndex];
          const actualBlock = actualBranch.blocks[seg.blockIndex];

          reindexBasePath += `.$[branch${idx}].blocks.$[block${idx}].branches`;
          reindexBaseFilters.push({ [`branch${idx}._id`]: new mongoose.Types.ObjectId(actualBranch._id) });
          reindexBaseFilters.push({ [`block${idx}._id`]: new mongoose.Types.ObjectId(actualBlock._id) });

          reindexCurrentBranches = actualBlock.branches;
        }

        await Promise.all(updatedBranch.blocks.map((block, idx) => {
          return ElementParameterData.updateOne(
            { "_id": parentId },
            { "$set": { [reindexBasePath + `.$[targetBranch].blocks.${idx}.index`]: idx } },
            { arrayFilters: [...reindexBaseFilters, { "targetBranch._id": new mongoose.Types.ObjectId(containingBranch._id) }] }
          );
        }));
      }

      const finalDocument = await ElementParameterData.findById(parentId);

      return res.status(200).json({
        success: true,
        message: `Parallel section added to branch ${containingBranch._id}`,
        data: finalDocument,
        newBlock: newParallelBlock,
        containingBranchId: containingBranch._id,
        targetId
      });
    }

    // ── TOP-LEVEL: create a brand new parallel section document ─────────────
    if (!branches || !Array.isArray(branches) || branches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Branches data is required for new parallel section"
      });
    }

    const formattedBranches = branches.map((branch, branchIdx) => {
      let blocks = branch.blocks || [];
      if (typeof blocks === "string") {
        try { blocks = JSON.parse(blocks); } catch { blocks = []; }
      }

      // Filter out invalid/empty blocks
      const formattedBlocks = blocks
        .filter(block => block && (block.id || block.blockId || block._id))
        .map((block, blockIdx) => ({
          _id: new mongoose.Types.ObjectId(),
          index: blockIdx,
          blockId: block.id || block.blockId || Date.now() + blockIdx,
          name: block.name || `Block ${blockIdx + 1}`,
          type: block.type || "Regular",
          elementType: block.type || "Regular",
          fr: block.fr || block.failureRate || '',
          mtbf: block.mtbf || "",
          ...(block.type === "Regular" && {
            partNumber: block.partNumber,
            productName: block.productName,
            fmecaId: block.fmecaId,
            fmDescription: block.fmDescription,
            time: block.time,
            repair: block.repair,
            mttr: block.mttr,
            reliability: block.reliability,
            unavailability: block.unavailability,
            inspectionPeriod: block.inspectionPeriod,
            dutyCycle: block.dutyCycle,
            color: block.color,
            frDistribution: block.frDistribution,
            repairDistribution: block.repairDistribution,
            load: block.load,
            mct: block.mct,
          }),
          reliabilityData: block.reliabilityData || null
        }));

      return {
        _id: new mongoose.Types.ObjectId(),
        index: branchIdx,
        name: branch.name || `Branch ${branchIdx + 1}`,
        blocks: formattedBlocks
      };
    });

    // const parallelSection = await ElementParameterData.create({
    //   rbdId,
    //   projectId,
    //   companyId,
    //   productId,
    //   name: name || "Parallel Section",
    //   type: "Parallel Section",
    //   elementType: "Parallel Section",
    //   arrangement: arrangement || "horizontal",
    //   k: k || 1,
    //   n: n || branches.length,
    //   branches: formattedBranches,
    //   isParallel: true,
    //   isParallelBranch: false,
    // });

    const newParallelSection = {
      _id: new mongoose.Types.ObjectId(),
      rbdId,
      projectId,
      companyId,
      productId,
      name: name || "Parallel Section",
      type: "Parallel Section",
      elementType: "Parallel Section",
      arrangement: arrangement || "horizontal",
      k: k || 1,
      n: n || branches.length,
      branches: formattedBranches,
      isParallel: true,
      isParallelBranch: false,
    };

    const docs = await ElementParameterData.find({ rbdId });
    let arr = docs.map(doc => doc.toObject());


    if (arr.length === 0) {
      await ElementParameterData.create(newParallelSection);

      return res.status(201).json({
        success: true,
        message: "First parallel section created",
        data: [newParallelSection]
      });
    }

    if (targetId) {
      const targetIndex = arr.findIndex(d =>
        d._id.toString() === String(targetId)
      );


      if (targetIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Target not found"
        });
      }

      arr.splice(targetIndex + 1, 0, newParallelSection);
    } else {
      arr.push(newParallelSection);
    }

    arr = arr.map((item, idx) => ({
      ...item,
      index: idx
    }));

    await ElementParameterData.deleteMany({ rbdId });
    await ElementParameterData.insertMany(arr);

    return res.status(201).json({
      success: true,
      message: "Parallel section inserted successfully",
      data: arr
    });

  } catch (error) {
    console.error("Parallel Section Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating/updating Parallel Section",
      error: error.message
    });
  }
};


export const deleteelementParameters = async (req, res) => {
  const { id } = req.params

  const deleteBlock = await ElementParameterData.findByIdAndDelete(id)

  if (!deleteBlock) {
    console.log('No data')
  }

  res.status(201).json({
    success: true,
    message: 'Deleted Successfully'
  })
}

export const deleteNestedBlock = async (req, res) => {
  console.log('deleting nested block');
  console.log(req.body, 'req.body');
  console.log(req.params, 'req.params');

  try {
    const { parentId, blockId } = req.params;



    // Find the parent parallel section
    const parentSection = await ElementParameterData.findById(parentId);

    if (!parentSection) {
      return res.status(404).json({
        success: false,
        message: 'Parent parallel section not found'
      });
    }

    // Track deletion results
    let deletionResult = {
      found: false,
      deletedBlockData: null,
      modifiedSection: null
    };

    // Recursive function to find and delete block at any depth
    const deleteBlockRecursive = (section, targetBlockId, parentContext = null) => {
      let blockFound = false;
      let deletedBlockData = null;
      let updatedBranches = [];

      // If section has no branches, return
      if (!section.branches || section.branches.length === 0) {
        return { found: false, modifiedSection: section, branchDeleted: false };
      }

      // Iterate through each branch
      for (const branch of section.branches) {
        if (!branch.blocks || branch.blocks.length === 0) {
          updatedBranches.push(branch);
          continue;
        }

        // Check blocks in current branch
        let blockFoundInBranch = false;
        let blockToDelete = null;
        let remainingBlocks = [];

        for (const block of branch.blocks) {
          if (block._id.toString() === targetBlockId) {
            // Found the target block
            blockFound = true;
            blockFoundInBranch = true;
            deletedBlockData = block.toObject();
            continue; // Skip adding this block to remainingBlocks
          }

          // Check if this block is a nested parallel section
          if (block.type === "Parallel Section" || block.elementType === "Parallel Section") {
            // Recursively search inside nested parallel section
            const nestedResult = deleteBlockRecursive(block, targetBlockId, {
              parentSection: section,
              parentBranch: branch,
              blockIndex: branch.blocks.indexOf(block)
            });

            if (nestedResult.found) {
              // Block found in nested section
              blockFound = true;
              deletedBlockData = nestedResult.deletedBlockData;
              // Replace the nested section with the modified version
              remainingBlocks.push(nestedResult.modifiedSection);
              continue;
            }
          }

          // If we get here, block is not the target and not a nested section with target
          remainingBlocks.push(block);
        }

        if (blockFoundInBranch) {
          // We found the block in this branch's direct blocks
          if (remainingBlocks.length === 0) {
            // Branch has no blocks left, don't add this branch to updatedBranches
            continue;
          } else {
            // Branch still has blocks, add it with remaining blocks
            updatedBranches.push({
              ...branch.toObject(),
              blocks: remainingBlocks
            });
          }
        } else {
          // No block found in this branch, keep branch as is
          updatedBranches.push(branch);
        }
      }

      // Check if we need to handle branch deletion or conversion
      if (blockFound) {
        // Update section with modified branches
        section.branches = updatedBranches;

        // Update n (number of branches)
        section.n = updatedBranches.length;
        if (section.k > section.n) {
          section.k = section.n;
        }

        return {
          found: true,
          deletedBlockData: deletedBlockData,
          modifiedSection: section,
          branchDeleted: updatedBranches.length < section.branches?.length
        };
      }

      return {
        found: false,
        modifiedSection: section,
        deletedBlockData: null
      };
    };

    // Execute recursive deletion
    deletionResult = deleteBlockRecursive(parentSection, blockId);

    if (!deletionResult.found) {
      return res.status(404).json({
        success: false,
        message: 'Block not found in parallel section or any nested sections'
      });
    }

    const modifiedSection = deletionResult.modifiedSection;
    const deletedBlockData = deletionResult.deletedBlockData;

    // Check if the entire parallel section became empty
    if (!modifiedSection.branches || modifiedSection.branches.length === 0) {
      await ElementParameterData.findByIdAndDelete(parentId);

      return res.status(200).json({
        success: true,
        data: {
          deletedBlock: deletedBlockData,
          parentDeleted: true,
          convertedToRegular: false
        },
        message: 'Parent parallel section deleted as it had no branches left'
      });
    }

    // Check if only ONE branch remains - convert to regular block
    if (modifiedSection.branches.length === 1) {

      const remainingBranch = modifiedSection.branches[0];
      const blockToConvert = remainingBranch.blocks && remainingBranch.blocks.length > 0
        ? remainingBranch.blocks[0]
        : null;

      if (blockToConvert && blockToConvert.type !== "Parallel Section") {
        // Create a new regular block with data from the parallel section and the block
        const regularBlockData = {
          indexCount: blockToConvert.indexCount || modifiedSection.indexCount || '',
          partNumber: blockToConvert.partNumber || modifiedSection.partNumber || '',
          productName: blockToConvert.productName || modifiedSection.productName || '',
          fr: blockToConvert.fr || modifiedSection.fr || 0,
          mtbf: blockToConvert.mtbf || modifiedSection.mtbf || 0,
          productId: blockToConvert.productId || modifiedSection.productId,
          fmecaId: blockToConvert.fmecaId || modifiedSection.fmecaId,
          fmDescription: blockToConvert.fmDescription || modifiedSection.fmDescription || '',
          time: blockToConvert.time || modifiedSection.time || 0,
          repair: blockToConvert.repair || modifiedSection.repair || 'Full repair',
          inspectionPeriod: blockToConvert.inspectionPeriod || modifiedSection.inspectionPeriod || '',
          dutyCycle: blockToConvert.dutyCycle || modifiedSection.dutyCycle || 100,
          color: blockToConvert.color || modifiedSection.color || '#ffffff',
          frDistribution: blockToConvert.frDistribution || modifiedSection.frDistribution || '',
          repairDistribution: blockToConvert.repairDistribution || modifiedSection.repairDistribution || 'Exponential',
          load: blockToConvert.load || modifiedSection.load || 100,
          mct: blockToConvert.mct || modifiedSection.mct || 0,
          mttr: blockToConvert.mttr || modifiedSection.mttr || 0,

          reliability: blockToConvert.reliability || modifiedSection.reliability || 0,
          unavailability: blockToConvert.unavailability || modifiedSection.unavailability || 0,
          name: blockToConvert.name || modifiedSection.name || 'Regular Block',
          elementType: 'Regular',
          type: 'Regular',
          rbdId: modifiedSection.rbdId,
          projectId: modifiedSection.projectId,
          companyId: modifiedSection.companyId
        };
        // Delete the old parallel section
        await ElementParameterData.findByIdAndDelete(parentId);

        // Create the new regular block
        const newRegularBlock = await ElementParameterData.create(regularBlockData);

        return res.status(200).json({
          success: true,
          data: {
            deletedBlock: deletedBlockData,
            convertedBlock: newRegularBlock,
            parentDeleted: true,
            convertedToRegular: true
          },
          message: 'Parallel section converted to regular block as only one branch remained'
        });
      } else if (blockToConvert && blockToConvert.type === "Parallel Section") {
        // The remaining block is a parallel section, keep it as is
        await modifiedSection.save();

        return res.status(200).json({
          success: true,
          data: {
            deletedBlock: deletedBlockData,
            remainingParallelSection: blockToConvert,
            parentDeleted: false,
            convertedToRegular: false
          },
          message: 'Block deleted, remaining parallel section preserved'
        });
      }
    }

    // Save the modified section
    await modifiedSection.save();

    res.status(200).json({
      success: true,
      data: {
        deletedBlock: deletedBlockData,
        parentDeleted: false,
        convertedToRegular: false,
        remainingBranches: modifiedSection.branches.length,
        updatedK: modifiedSection.k,
        updatedN: modifiedSection.n
      },
      message: 'Nested block deleted successfully'
    });

  } catch (error) {
    console.log('Error deleting nested block:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting nested block',
      error: error.message
    });
  }
};


export const addParallelBranch = async (req, res) => {
  const { rbdId, projectId } = req.params;

  try {
    const { startBlockId, endBlockId, companyId } = req.body;
    // startBlockId = RelateId of block LEFT of start node (can be null if first node)
    // endBlockId   = RelateId of block RIGHT of end node

    // 1. Fetch all docs for this RBD in order
    const allDocs = await ElementParameterData.find({ rbdId }).sort({ index: 1 });
    let arr = allDocs.map(d => d.toObject());

    // 2. Find si and ei (same logic as frontend)
    const getId = (d) => String(d._id ?? d.id ?? "");

    const si = startBlockId == null
      ? -1
      : arr.findIndex(d => getId(d) === String(startBlockId));

    const ei = endBlockId == null
      ? arr.length - 1
      : arr.findIndex(d => getId(d) === String(endBlockId));

    if (si === -1 && startBlockId != null) {
      return res.status(404).json({ success: false, message: "Start block not found" });
    }
    if (ei === -1) {
      return res.status(404).json({ success: false, message: "End block not found" });
    }

    // 3. mainBlocks = arr[si+1 .. ei] inclusive (same as frontend slice)
    const wrapStart = si + 1;
    const wrapEnd = ei + 1; // slice end exclusive

    if (wrapStart >= wrapEnd) {
      return res.status(400).json({
        success: false,
        message: "No blocks between the selected nodes"
      });
    }

    const mainBlocks = arr.slice(wrapStart, wrapEnd);
    if (!mainBlocks.length) {
      return res.status(400).json({
        success: false,
        message: "No blocks between the selected nodes"
      });
    }

    // 4. Build the new Parallel Section (mirrors frontend section object exactly)
    const newParallelSection = {
      _id: new mongoose.Types.ObjectId(),
      rbdId,
      projectId,
      companyId: companyId || mainBlocks[0].companyId,
      productId: mainBlocks[0].productId || null,
      name: "Parallel Section",
      type: "Parallel Section",
      elementType: "Parallel Section",
      arrangement: "horizontal",
      k: 1,
      n: 2,
      isParallel: true,
      isParallelBranch: false,
      kOfNType: "Identical",
      branches: [
        {
          // Branch 1: Main Branch — contains the wrapped mainBlocks
          _id: new mongoose.Types.ObjectId(),
          index: 0,
          name: "Main Branch",
          blocks: mainBlocks.map((block, bIdx) => ({
            _id: new mongoose.Types.ObjectId(),
            index: bIdx,
            blockId: block.blockId || null,
            name: block.name || `Block ${bIdx + 1}`,
            type: block.type || "Regular",
            elementType: block.elementType || "REGULAR",
            fr: block.fr ?? 0,
            mtbf: block.mtbf ?? 0,
            partNumber: block.partNumber,
            productName: block.productName,
            fmecaId: block.fmecaId,
            fmDescription: block.fmDescription,
            repair: block.repair,
            mttr: block.mttr,
            inspectionPeriod: block.inspectionPeriod,
            dutyCycle: block.dutyCycle,
            color: block.color,
            frDistribution: block.frDistribution,
            repairDistribution: block.repairDistribution,
            load: block.load,
            mct: block.mct,
            k: block.k,
            n: block.n,
            rbdId: block.rbdId,
            projectId: block.projectId,
            companyId: block.companyId,
            productId: block.productId,
            branches: [],
            // Preserve nested parallel section branches if block is a Parallel Section
            ...(block.elementType === "Parallel Section" && {
              branches: block.branches || [],
              arrangement: block.arrangement,
              isParallel: true,
            }),
          })),
        },
        {
          // Branch 2: Bypass Branch — empty bypass (mirrors frontend exactly)
          _id: new mongoose.Types.ObjectId(),
          index: 1,
          name: "Bypass Branch",
          blocks: [
            {
              _id: new mongoose.Types.ObjectId(),
              index: 0,
              name: "Bypass Block",
              type: "Regular",
              elementType: "REGULAR",
              fr: 0,
              mtbf: 0,
              branches: [],
            }
          ],
        }
      ],
      components: [],
    };

    // 5. Remove mainBlocks from arr, insert new Parallel Section at their position
    //    (same logic as frontend)
    const toRemove = new Set(mainBlocks.map(d => getId(d)));
    const insertAt = arr.findIndex(d => getId(d) === getId(mainBlocks[0]));

    const remaining = arr.filter(d => !toRemove.has(getId(d)));

    // Find insert position in remaining array (after removals)
    let insertInRemaining = remaining.findIndex(d => {
      const origIdx = arr.findIndex(ob => getId(ob) === getId(d));
      return origIdx > insertAt + mainBlocks.length - 1;
    });
    if (insertInRemaining === -1) insertInRemaining = remaining.length;

    const next = [...remaining];
    next.splice(insertInRemaining, 0, newParallelSection);

    // 6. Re-index
    const reIndexed = next.map((item, idx) => ({ ...item, index: idx }));

    // 7. Delete old docs for this RBD, insert the new array
    //    Also delete the mainBlock docs since they are now embedded inside the branch
    await ElementParameterData.deleteMany({ rbdId });
    await ElementParameterData.insertMany(reIndexed);

    return res.status(201).json({
      success: true,
      message: "Parallel branch created successfully",
      data: reIndexed,
      newParallelSection,
    });

  } catch (error) {
    console.error("addParallelBranch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating parallel branch",
      error: error.message
    });
  }
};