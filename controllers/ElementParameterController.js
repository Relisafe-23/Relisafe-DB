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
  console.log('calling element parameter');
  console.log(req.body);

  try {
    const data = req.body;
    const idforApi = data?.idforApi;

    console.log(idforApi, ": idforApi");

    // If idforApi exists, push a new block to the branch
    if (idforApi) {
      const { ItemId, branchId, branchIndex, location, nested } = idforApi;

      console.log('Branch ID:', branchId);
      console.log('Is nested:', nested);
      console.log('Location:', location);

      // First, get the current document
      const parentDocument = await ElementParameterData.findById(ItemId);

      if (!parentDocument) {
        return res.status(404).json({
          success: false,
          message: "Parent document not found"
        });
      }

      // Function to find a branch recursively in nested parallel sections
      const findBranchRecursively = (branches, targetBranchId) => {
        for (let i = 0; i < branches.length; i++) {
          const branch = branches[i];

          // Check if this branch matches
          if (branch._id.toString() === targetBranchId) {
            return { branch, parentPath: [], branchIndex: i };
          }

          // Check if any block in this branch contains nested parallel sections
          if (branch.blocks && branch.blocks.length > 0) {
            for (let j = 0; j < branch.blocks.length; j++) {
              const block = branch.blocks[j];
              if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
                block.branches && block.branches.length > 0) {
                // Recursively search in nested parallel section
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

      // First check top-level branches
      targetBranch = parentDocument.branches.find(b => b._id.toString() === branchId);

      if (!targetBranch && nested) {
        // Search in nested parallel sections
        const result = findBranchRecursively(parentDocument.branches, branchId);
        if (result) {
          targetBranch = result.branch;
          parentPath = result.parentPath;
          console.log('Found nested branch:', targetBranch._id);
          console.log('Parent path:', parentPath);
        }
      }

      if (!targetBranch) {
        return res.status(404).json({
          success: false,
          message: `Branch not found with id: ${branchId}`
        });
      }

      const currentBlocks = targetBranch.blocks || [];

      // Create new block object
      const newBlock = {
        _id: new mongoose.Types.ObjectId(),
        index: currentBlocks.length,
        blockId: data.blockId || Date.now(),
        name: data.productName || data.blockType || "New Block",
        type: data.blockType || data.type || "Regular",
        elementType: data.elementType || data.type || "Regular",
        fr: data.fr || 0.001,
        mtbf: data.mtbf || (data.fr ? 1000 / data.fr : 1000),
        time: data.time,
        repair: data.repair,
        inspectionPeriod: data.inspectionPeriod,
        dutyCycle: data.dutyCycle,
        color: data.color,
        frDistribution: data.frDistribution,
        repairDistribution: data.repairDistribution,
        load: data.load,
        mct: data.mct,
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

      // If branch is nested (inside a parallel section block)
      if (parentPath.length > 0) {
        console.log('Updating nested branch');

        // Build the update path through nested structures
        let pathString = "branches";
        let arrayFilters = [];

        // Build the path for each level of nesting
        for (let idx = 0; idx < parentPath.length; idx++) {
          const seg = parentPath[idx];
          pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
          arrayFilters.push({ [`branch${idx}._id`]: parentDocument.branches[seg.branchIndex]._id });
          arrayFilters.push({ [`block${idx}._id`]: seg.blockId });
        }

        // Add the target branch
        pathString += `.$[targetBranch].blocks`;
        arrayFilters.push({ [`targetBranch._id`]: branchId });

        if (location && location.includes('left')) {
          updatedRBD = await ElementParameterData.findOneAndUpdate(
            { "_id": ItemId },
            {
              "$push": {
                [pathString]: {
                  "$each": [newBlock],
                  "$position": 0
                }
              }
            },
            { arrayFilters, new: true }
          );
        } else {
          updatedRBD = await ElementParameterData.findOneAndUpdate(
            { "_id": ItemId },
            {
              "$push": {
                [pathString]: newBlock
              }
            },
            { arrayFilters, new: true }
          );
        }
      } else {
        // Top-level branch - use simple update
        console.log('Updating top-level branch');

        if (location && location.includes('left')) {
          updatedRBD = await ElementParameterData.findOneAndUpdate(
            { "_id": ItemId, "branches._id": branchId },
            {
              "$push": {
                "branches.$.blocks": {
                  "$each": [newBlock],
                  "$position": 0
                }
              }
            },
            { new: true }
          );

          // Reindex blocks after left insertion
          if (updatedRBD) {
            const updatedBranch = updatedRBD.branches.find(b => b._id.toString() === branchId);
            if (updatedBranch) {
              const updateIndexPromises = updatedBranch.blocks.map((block, idx) => {
                return ElementParameterData.updateOne(
                  { "_id": ItemId, "branches._id": branchId, "branches.blocks._id": block._id },
                  { "$set": { "branches.$[branch].blocks.$[block].index": idx } },
                  { "arrayFilters": [{ "branch._id": branchId }, { "block._id": block._id }] }
                );
              });
              await Promise.all(updateIndexPromises);
              updatedRBD = await ElementParameterData.findById(ItemId);
            }
          }
        } else {
          const nextBlockIndex = currentBlocks.length > 0
            ? Math.max(...currentBlocks.map(b => b.index || 0)) + 1
            : 0;
          newBlock.index = nextBlockIndex;

          updatedRBD = await ElementParameterData.findOneAndUpdate(
            { "_id": ItemId, "branches._id": branchId },
            { "$push": { "branches.$.blocks": newBlock } },
            { new: true }
          );
        }
      }

      if (updatedRBD) {
        return res.status(200).json({
          success: true,
          message: "New block added successfully",
          data: updatedRBD,
          newBlock: newBlock
        });
      } else {
        throw new Error("Failed to add block to branch");
      }
    }

    // If no idforApi, create separate ElementParameterData
    const elementParameters = await ElementParameterData.create({
      indexCount: data.indexCount,
      partNumber: data.partNumber,
      productName: data.productName,
      rbdId: data.rbdId,
      fr: data.fr,
      blockId: data.blockId,
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
      type: data.blockType || data.type || "Regular",
    });

    res.status(201).json({
      success: true,
      data: elementParameters
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
  console.log(id, 'id form frontend')
  console.log(data, 'data for update')
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
  try {
    const { parentId, blockId } = req.params;
    const updateData = req.body;

    console.log('Parent ID:', parentId);
    console.log('Block ID:', blockId);
    console.log('Update data:', updateData);

    // Find the parent parallel section
    const parentSection = await ElementParameterData.findById(parentId);

    if (!parentSection) {
      return res.status(404).json({
        success: false,
        message: 'Parent parallel section not found'
      });
    }

    // Track if block was found and updated
    let blockFound = false;
    let updatedBlockData = null;

    // Manually update the nested block
    parentSection.branches = parentSection.branches.map(branch => {
      if (branch.blocks) {
        branch.blocks = branch.blocks.map(block => {
          // Check if this is the block we want to update
          if (block._id.toString() === blockId) {
            blockFound = true;

            // Merge existing block with update data
            updatedBlockData = {
              ...block.toObject(),
              ...updateData,
              _id: block._id, // Preserve the original _id
              type: 'Regular', // Ensure type is set
              elementType: 'Regular' // Ensure elementType is set
            };

            return updatedBlockData;
          }
          return block;
        });
      }
      return branch;
    });

    if (!blockFound) {
      return res.status(404).json({
        success: false,
        message: 'Block not found in parallel section'
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

  console.log(data, 'data')
  console.log(rbdId, 'rbdId')
  console.log(projectId, 'projectId')

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

// export const createParallelSection = async (req, res) => {
//   const { rbdId, projectId } = req.params;
//   console.log(rbdId, "rbdId para sec")
//   console.log(projectId, "projectId para sec")

//   console.log(req.body, 'req.body for data')

//   try {
//     const {
//       companyId,
//       productId,
//       name,
//       arrangement,
//       k,
//       n,
//       branches,
//       data,
//       isNested,
//       parentId,
//       targetId,
//     } = req.body;

//     if (targetId && parentId) {
//       console.log("============================")
//       console.log("it can be insert to nested ")
//       console.log("============================")

//       const parentDocument = await ElementParameterData.findById(parentId);
//       if (!parentDocument) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent document not found"
//         });
//       }

//       console.log(parentDocument, 'parentDocument')



//       if (parentDocument?.elementType === 'Parallel Section') {
//         console.log('correct');
//         var loopbranch = parentDocument?.branches;

//         for (let i = 0; i < loopbranch.length; i++) {
//           console.log(loopbranch[i].blocks);

//           if (loopbranch[i].blocks && loopbranch[i].blocks.length > 0) {
//             console.log('entered inner loop');

//             for (let j = 0; j < loopbranch[i].blocks.length; j++) {
//               const block = loopbranch[i].blocks[j];

//               if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
//                 block.branches && block.branches.length > 0) {
//                 console.log('Found nested parallel section in block:', block._id);

//                 for (let k = 0; k < block.branches.length; k++) {
//                   const nestedBranch = block.branches[k];
//                   console.log('Nested branch', k, 'blocks:', nestedBranch.blocks);

//                   // Fix: Need to loop through blocks array to find matching block ID
//                   if (nestedBranch.blocks && nestedBranch.blocks.length > 0) {
//                     for (let m = 0; m < nestedBranch.blocks.length; m++) {
//                       const nestedBlock = nestedBranch.blocks[m];
//                       if (targetId === nestedBlock._id.toString()) {
//                         console.log('Found target block:', targetId);
//                         console.log('Parent branch ID where this block belongs:', nestedBranch._id);
//                         console.log('This is the branch where I need to put the new element:', nestedBranch._id);

//                         // Store the found branch ID for later use
//                         const foundBranchId = nestedBranch._id;
//                         // Now you can add your new element to this branch's blocks array
//                       }
//                     }
//                   }

//                   // Alternative: If you're looking for the branch ID itself
//                   if (targetId === nestedBranch._id.toString()) {
//                     console.log('Target is the branch itself:', nestedBranch._id);
//                     console.log('This is the branch where I need to put the new element:', nestedBranch._id);
//                   }
//                 }
//               }
//             }
//           }
//           console.log(i, "'th branch ");
//         }
//       }

//       // const findBranchPath = (branches, targetBranchId, currentPath = []) => {
//       //   for (let i = 0; i < branches.length; i++) {
//       //     const branch = branches[i];

//       //     // Check if this branch matches
//       //     // console.log(branch._id, branch,'iiiiiiiiiiiii')
//       //     if (branch._id.toString() === targetId) {
//       //       console.log(blocks)
//       //       return {
//       //         found: true,
//       //         branchIndex: i,
//       //         branch: branch,
//       //         path: [...currentPath, { branchIndex: i, isBranch: true }]
//       //       };
//       //     }

//       //     // Check if any block in this branch contains nested parallel sections
//       //     if (branch.blocks && branch.blocks.length > 0) {
//       //       for (let j = 0; j < branch.blocks.length; j++) {
//       //         const block = branch.blocks[j];
//       //         if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') &&
//       //           block.branches && block.branches.length > 0) {
//       //           // Recursively search in nested parallel section
//       //           const result = findBranchPath(block.branches, targetBranchId,
//       //             [...currentPath, { branchIndex: i, blockIndex: j, isParallelBlock: true }]);
//       //           if (result.found) return result;
//       //         }
//       //       }
//       //     }
//       //   }
//       //   return { found: false };
//       // };
//     }




//     // If idforApi exists, we're adding a nested parallel section to an existing branch
//     if (data?.idforApi) {
//       // console.log(data?.idforApi, ' - idforApi data');

//       const { ItemId, branchId, branchIndex, location } = data.idforApi;

//       // console.log(`Adding nested parallel section to branch ${branchId} at location: ${location}`);

//       // Find the parent parallel section
//       const parentDocument = await ElementParameterData.findById(ItemId);
//       if (!parentDocument) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent parallel section not found"
//         });
//       }

//       // console.log(parentDocument, 'parentDocument')

//       // Find the specific branch
//       const targetBranch = parentDocument.branches.find(
//         b => b._id.toString() === branchId || b.index === branchIndex
//       );

//       console.log(targetBranch, 'target branch details');
//       console.log(branchId, 'branchId');
//       console.log(branchIndex, 'branchIndex');

//       if (!targetBranch) {
//         return res.status(404).json({
//           success: false,
//           message: "Branch not found"
//         });
//       }

//       // // Validate that we have branches data for the nested parallel section
//       if (!branches || !Array.isArray(branches) || branches.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Branches data is required for nested parallel section"
//         });
//       }

//       // // Format the nested branches with their blocks
//       const formattedNestedBranches = branches.map((nestedBranch, branchIdx) => {
//         let blocks = nestedBranch.blocks || [];

//         // If blocks came as string convert to array
//         if (typeof blocks === "string") {
//           try {
//             blocks = JSON.parse(blocks);
//           } catch (err) {
//             blocks = [];
//           }
//         }

//         // Format each block in the nested branch
//         const formattedBlocks = blocks.map((block, blockIdx) => ({
//           _id: new mongoose.Types.ObjectId(),
//           index: blockIdx,
//           blockId: block.id || block.blockId || Date.now() + blockIdx,
//           name: block.name || `Block ${blockIdx + 1}`,
//           type: block.type || "Regular",
//           elementType: block.type || "Regular",
//           fr: block.fr ?? block.failureRate ?? 0.001,
//           mtbf: block.mtbf ?? 1000,
//           ...(block.type === "Regular" && {
//             // Regular block fields
//             partNumber: block.partNumber,
//             productName: block.productName,
//             fmecaId: block.fmecaId,
//             fmDescription: block.fmDescription,
//             time: block.time,
//             repair: block.repair,
//             inspectionPeriod: block.inspectionPeriod,
//             dutyCycle: block.dutyCycle,
//             color: block.color,
//             frDistribution: block.frDistribution,
//             repairDistribution: block.repairDistribution,
//             load: block.load,
//             mct: block.mct,
//           }),
//           reliabilityData: block.reliabilityData || null
//         }));

//         return {
//           _id: new mongoose.Types.ObjectId(),
//           index: branchIdx,
//           name: nestedBranch.name || `Nested Branch ${branchIdx + 1}`,
//           blocks: formattedBlocks
//         };
//       });

//       // // Create the nested parallel section block
//       const nestedParallelBlock = {
//         _id: new mongoose.Types.ObjectId(),
//         index: targetBranch.blocks?.length || 0,
//         blockId: req.body.blockId || Date.now(),
//         name: name || "Nested Parallel Section",
//         type: "Parallel Section",
//         elementType: "Parallel Section",
//         fr: null,
//         mtbf: null,
//         arrangement: arrangement || "horizontal",
//         k: k || 1,
//         n: n || branches.length,
//         branches: formattedNestedBranches,  // This contains all nested branches
//         isNested: true,
//         parentBranchId: branchId,
//         parentSectionId: ItemId,
//         reliabilityData: {
//           elementType: "Parallel Section",
//           isNestedParallel: true,
//           arrangement: arrangement || "horizontal",
//           k: k || 1,
//           n: n || branches.length,
//           parentBranchId: branchId,
//           parentSectionId: ItemId,
//           branchCount: branches.length
//         }
//       };

//       let updatedDocument;
//       let insertedPosition = 'right';

//       // // Determine insertion position based on location
//       if (location && location.includes('left')) {
//         // Insert at the beginning (left side)
//         updatedDocument = await ElementParameterData.findOneAndUpdate(
//           {
//             "_id": ItemId,
//             "branches._id": branchId
//           },
//           {
//             "$push": {
//               "branches.$.blocks": {
//                 "$each": [nestedParallelBlock],
//                 "$position": 0
//               }
//             }
//           },
//           { new: true }
//         );
//         insertedPosition = 'left';

//         // Reindex all blocks in this branch
//         if (updatedDocument) {
//           const updatedBranch = updatedDocument.branches.find(
//             b => b._id.toString() === branchId
//           );

//           if (updatedBranch) {
//             const updatePromises = updatedBranch.blocks.map((block, idx) => {
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

//             await Promise.all(updatePromises);
//             updatedDocument = await ElementParameterData.findById(ItemId);
//           }
//         }

//         console.log(`Nested parallel section with ${branches.length} branches added to left side`);

//       } else if (location && location.includes('mid')) {
//         // Insert in the middle (between existing blocks)
//         const parts = location.split('-');
//         const midIndex = parseInt(parts[parts.length - 1]);

//         updatedDocument = await ElementParameterData.findOneAndUpdate(
//           {
//             "_id": ItemId,
//             "branches._id": branchId
//           },
//           {
//             "$push": {
//               "branches.$.blocks": {
//                 "$each": [nestedParallelBlock],
//                 "$position": midIndex + 1
//               }
//             }
//           },
//           { new: true }
//         );
//         insertedPosition = `mid-${midIndex + 1}`;

//         // Reindex all blocks in this branch after insertion
//         if (updatedDocument) {
//           const updatedBranch = updatedDocument.branches.find(
//             b => b._id.toString() === branchId
//           );

//           if (updatedBranch) {
//             const updatePromises = updatedBranch.blocks.map((block, idx) => {
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

//             await Promise.all(updatePromises);
//             updatedDocument = await ElementParameterData.findById(ItemId);
//           }
//         }

//         console.log(`Nested parallel section added at position ${midIndex + 1}`);

//       } else {
//         // Default: Add at the end (right side)
//         const nextIndex = targetBranch.blocks?.length > 0
//           ? Math.max(...targetBranch.blocks.map(b => b.index || 0)) + 1
//           : 0;

//         nestedParallelBlock.index = nextIndex;

//         updatedDocument = await ElementParameterData.findOneAndUpdate(
//           {
//             "_id": ItemId,
//             "branches._id": branchId
//           },
//           {
//             "$push": {
//               "branches.$.blocks": nestedParallelBlock
//             }
//           },
//           { new: true }
//         );

//         console.log(`Nested parallel section with ${branches.length} branches added to right side`);
//       }

//       if (updatedDocument) {
//         return res.status(200).json({
//           success: true,
//           message: `Nested parallel section with ${branches.length} branches added to branch at ${insertedPosition} position`,
//           data: updatedDocument,
//           newBlock: nestedParallelBlock,
//           position: insertedPosition
//         });
//       } else {
//         throw new Error("Failed to add nested parallel section to branch");
//       }
//     }

//     // If no idforApi, create a new top-level parallel section
//     if (!branches || !Array.isArray(branches) || branches.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Branches data is required for new parallel section"
//       });
//     }

//     // Format branches for top-level parallel section
//     const formattedBranches = branches.map((branch, branchIdx) => {
//       let blocks = branch.blocks || [];

//       if (typeof blocks === "string") {
//         try {
//           blocks = JSON.parse(blocks);
//         } catch (err) {
//           blocks = [];
//         }
//       }

//       const formattedBlocks = blocks.map((block, blockIdx) => ({
//         _id: new mongoose.Types.ObjectId(),
//         index: blockIdx,
//         blockId: block.id || block.blockId || Date.now() + blockIdx,
//         name: block.name || `Block ${blockIdx + 1}`,
//         type: block.type || "Regular",
//         elementType: block.type || "Regular",
//         fr: block.fr ?? block.failureRate ?? 0.001,
//         mtbf: block.mtbf ?? 1000,
//         ...(block.type === "Regular" && {
//           partNumber: block.partNumber,
//           productName: block.productName,
//           fmecaId: block.fmecaId,
//           fmDescription: block.fmDescription,
//           time: block.time,
//           repair: block.repair,
//           inspectionPeriod: block.inspectionPeriod,
//           dutyCycle: block.dutyCycle,
//           color: block.color,
//           frDistribution: block.frDistribution,
//           repairDistribution: block.repairDistribution,
//           load: block.load,
//           mct: block.mct,
//         }),
//         reliabilityData: block.reliabilityData || null
//       }));

//       return {
//         _id: new mongoose.Types.ObjectId(),
//         index: branchIdx,
//         name: branch.name || `Branch ${branchIdx + 1}`,
//         blocks: formattedBlocks
//       };
//     });

//     const parallelSection = await ElementParameterData.create({
//       rbdId,
//       projectId,
//       companyId,
//       productId,
//       name: name || "Parallel Section",
//       type: "Parallel Section",
//       elementType: "Parallel Section",
//       arrangement: arrangement || "horizontal",
//       k: k || 1,
//       n: n || branches.length,
//       branches: formattedBranches,
//       isParallel: true
//     });

//     res.status(201).json({
//       success: true,
//       message: `Parallel Section created successfully with ${branches.length} branches`,
//       data: parallelSection
//     });

//   } catch (error) {
//     console.error("Parallel Section Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating/updating Parallel Section",
//       error: error.message
//     });
//   }
// };




// export const createParallelSection = async (req, res) => {
//   const { rbdId, projectId } = req.params;
//   console.log(rbdId, "rbdId para sec");
//   console.log(projectId, "projectId para sec");
//   console.log(req.body, 'req.body for data');

//   try {
//     const {
//       companyId,
//       productId,
//       name,
//       arrangement,
//       k,
//       n,
//       branches,
//       data,
//       isNested,
//       parentId,
//       targetId,  // This is the BRANCH ID (69d4a5b5fc410e29cfa59865) where we add the parallel section as a block
//     } = req.body;

//     // CASE 1: Adding parallel section as a block to a branch (using targetId as branch ID)
//     if (targetId && parentId) {
//       console.log("============================");
//       console.log("Adding parallel section as a block to branch");
//       console.log("Target Branch ID:", targetId);
//       console.log("Parent Section ID:", parentId);
//       console.log("============================");

//       // Find the parent document
//       const parentDocument = await ElementParameterData.findById(parentId);
//       if (!parentDocument) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent document not found"
//         });
//       }

//       console.log(parentDocument)

//       // Function to find a branch recursively (including nested branches)
//       const findBranchPath = (branches, targetBranchId, currentPath = []) => {
//         for (let i = 0; i < branches.length; i++) {
//           const branch = branches[i];

//           // Check if this branch matches
//           // console.log(branch._id, branch,'iiiiiiiiiiiii')
//           if (branch._id.toString() === targetId) {
//             console.log(blocks)
//             return { 
//               found: true, 
//               branchIndex: i, 
//               branch: branch,
//               path: [...currentPath, { branchIndex: i, isBranch: true }]
//             };
//           }

//           // Check if any block in this branch contains nested parallel sections
//           if (branch.blocks && branch.blocks.length > 0) {
//             for (let j = 0; j < branch.blocks.length; j++) {
//               const block = branch.blocks[j];
//               if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') && 
//                   block.branches && block.branches.length > 0) {
//                 // Recursively search in nested parallel section
//                 const result = findBranchPath(block.branches, targetBranchId, 
//                   [...currentPath, { branchIndex: i, blockIndex: j, isParallelBlock: true }]);
//                 if (result.found) return result;
//               }
//             }
//           }
//         }
//         return { found: false };
//       };

//       // Find the target branch
//       const branchLocation = findBranchPath(parentDocument.branches, targetId);

//       console.log(branchLocation, 'branchLocation');

//       if (!branchLocation.found) {
//         return res.status(404).json({
//           success: false,
//           message: `Target branch not found with id: ${targetId}`
//         });
//       }

//       const targetBranch = branchLocation.branch;
//       console.log('Found target branch:', targetBranch._id, 'Branch Name:', targetBranch.name);
//       console.log('Current blocks in branch:', targetBranch.blocks.length);

//       // Validate that we have branches data for the new parallel section
//       if (!branches || !Array.isArray(branches) || branches.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Branches data is required for parallel section"
//         });
//       }

//       // Format the branches for the new parallel section
//       const formattedNestedBranches = branches.map((nestedBranch, branchIdx) => {
//         let blocks = nestedBranch.blocks || [];

//         if (typeof blocks === "string") {
//           try {
//             blocks = JSON.parse(blocks);
//           } catch (err) {
//             blocks = [];
//           }
//         }

//         const formattedBlocks = blocks.map((block, blockIdx) => ({
//           _id: new mongoose.Types.ObjectId(),
//           index: blockIdx,
//           blockId: block.id || block.blockId || Date.now() + blockIdx,
//           name: block.name || `Block ${blockIdx + 1}`,
//           type: block.type || "Regular",
//           elementType: block.type || "Regular",
//           fr: block.fr ?? block.failureRate ?? 0.001,
//           mtbf: block.mtbf ?? 1000,
//           ...(block.type === "Regular" && {
//             partNumber: block.partNumber,
//             productName: block.productName,
//             fmecaId: block.fmecaId,
//             fmDescription: block.fmDescription,
//             time: block.time,
//             repair: block.repair,
//             inspectionPeriod: block.inspectionPeriod,
//             dutyCycle: block.dutyCycle,
//             color: block.color,
//             frDistribution: block.frDistribution,
//             repairDistribution: block.repairDistribution,
//             load: block.load,
//             mct: block.mct,
//           }),
//           reliabilityData: block.reliabilityData || null
//         }));

//         return {
//           _id: new mongoose.Types.ObjectId(),
//           index: branchIdx,
//           name: nestedBranch.name || `Branch ${branchIdx + 1}`,
//           blocks: formattedBlocks
//         };
//       });

//       // Create the new parallel section block to add to the branch's blocks array
//       const newParallelBlock = {
//         _id: new mongoose.Types.ObjectId(),
//         index: targetBranch.blocks?.length || 0,
//         blockId: req.body.blockId || Date.now(),
//         name: name || "Parallel Section",
//         type: "Parallel Section",
//         elementType: "Parallel Section",
//         fr: null,
//         mtbf: null,
//         arrangement: arrangement || "horizontal",
//         k: k || 1,
//         n: n || branches.length,
//         branches: formattedNestedBranches,
//         isNested: true,
//         parentBranchId: targetId,
//         parentSectionId: parentId,
//         reliabilityData: {
//           elementType: "Parallel Section",
//           isNestedParallel: true,
//           arrangement: arrangement || "horizontal",
//           k: k || 1,
//           n: n || branches.length,
//           parentBranchId: targetId,
//           parentSectionId: parentId,
//           branchCount: branches.length
//         }
//       };

//       // Build the update path to reach the target branch's blocks array
//       let pathString = "branches";
//       let arrayFilters = [];

//       for (let idx = 0; idx < branchLocation.path.length; idx++) {
//         const seg = branchLocation.path[idx];

//         if (seg.isParallelBlock) {
//           // This is a block that contains a nested parallel section
//           pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
//           arrayFilters.push({ [`branch${idx}._id`]: parentDocument.branches[seg.branchIndex]._id });
//           arrayFilters.push({ [`block${idx}._id`]: parentDocument.branches[seg.branchIndex].blocks[seg.blockIndex]._id });
//         } else if (seg.isBranch) {
//           // This is a branch at the current level
//           pathString += `.$[branch${idx}]`;
//           arrayFilters.push({ [`branch${idx}._id`]: parentDocument.branches[seg.branchIndex]._id });
//         }
//       }

//       // Add the blocks array path
//       pathString += `.blocks`;

//       console.log('Path string:', pathString);
//       console.log('Array filters:', JSON.stringify(arrayFilters, null, 2));

//       // Update the document by pushing the new parallel section to the branch's blocks array
//       const updatedDocument = await ElementParameterData.findOneAndUpdate(
//         { "_id": parentId },
//         {
//           "$push": {
//             [pathString]: newParallelBlock
//           }
//         },
//         { arrayFilters, new: true }
//       );

//       if (updatedDocument) {
//         // Reindex blocks in the target branch to maintain correct indices
//         const findUpdatedBranch = (branches) => {
//           for (const branch of branches) {
//             if (branch._id.toString() === targetId) {
//               return branch;
//             }
//             if (branch.blocks) {
//               for (const block of branch.blocks) {
//                 if ((block.type === 'Parallel Section' || block.elementType === 'Parallel Section') && block.branches) {
//                   const found = findUpdatedBranch(block.branches);
//                   if (found) return found;
//                 }
//               }
//             }
//           }
//           return null;
//         };

//         const updatedBranch = findUpdatedBranch(updatedDocument.branches);
//         if (updatedBranch && updatedBranch.blocks) {
//           const updateIndexPromises = updatedBranch.blocks.map((block, idx) => {
//             // Build the path for reindexing
//             let reindexPathString = "branches";
//             let reindexArrayFilters = [];

//             for (let idx2 = 0; idx2 < branchLocation.path.length; idx2++) {
//               const seg = branchLocation.path[idx2];
//               if (seg.isParallelBlock) {
//                 reindexPathString += `.$[branch${idx2}].blocks.$[block${idx2}].branches`;
//                 reindexArrayFilters.push({ [`branch${idx2}._id`]: parentDocument.branches[seg.branchIndex]._id });
//                 reindexArrayFilters.push({ [`block${idx2}._id`]: parentDocument.branches[seg.branchIndex].blocks[seg.blockIndex]._id });
//               } else if (seg.isBranch) {
//                 reindexPathString += `.$[branch${idx2}]`;
//                 reindexArrayFilters.push({ [`branch${idx2}._id`]: parentDocument.branches[seg.branchIndex]._id });
//               }
//             }

//             reindexPathString += `.blocks.${idx}.index`;

//             return ElementParameterData.updateOne(
//               { "_id": parentId },
//               { "$set": { [reindexPathString]: idx } },
//               { arrayFilters: reindexArrayFilters }
//             );
//           });

//           await Promise.all(updateIndexPromises);
//         }

//         const finalDocument = await ElementParameterData.findById(parentId);

//         return res.status(200).json({
//           success: true,
//           message: `Parallel section with ${branches.length} branches added as a block to branch ${targetId}`,
//           data: finalDocument,
//           newBlock: newParallelBlock,
//           targetBranchId: targetId
//         });
//       } else {
//         throw new Error("Failed to add parallel section to branch");
//       }
//     }

//     // CASE 2: Adding nested parallel section to a branch (using data.idforApi)
//     if (data?.idforApi) {
//       const { ItemId, branchId, branchIndex, location } = data.idforApi;

//       const parentDocument = await ElementParameterData.findById(ItemId);
//       if (!parentDocument) {
//         return res.status(404).json({
//           success: false,
//           message: "Parent parallel section not found"
//         });
//       }

//       const targetBranch = parentDocument.branches.find(
//         b => b._id.toString() === branchId || b.index === branchIndex
//       );

//       if (!targetBranch) {
//         return res.status(404).json({
//           success: false,
//           message: "Branch not found"
//         });
//       }

//       if (!branches || !Array.isArray(branches) || branches.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Branches data is required for nested parallel section"
//         });
//       }

//       const formattedNestedBranches = branches.map((nestedBranch, branchIdx) => {
//         let blocks = nestedBranch.blocks || [];
//         if (typeof blocks === "string") {
//           try {
//             blocks = JSON.parse(blocks);
//           } catch (err) {
//             blocks = [];
//           }
//         }

//         const formattedBlocks = blocks.map((block, blockIdx) => ({
//           _id: new mongoose.Types.ObjectId(),
//           index: blockIdx,
//           blockId: block.id || block.blockId || Date.now() + blockIdx,
//           name: block.name || `Block ${blockIdx + 1}`,
//           type: block.type || "Regular",
//           elementType: block.type || "Regular",
//           fr: block.fr ?? block.failureRate ?? 0.001,
//           mtbf: block.mtbf ?? 1000,
//           ...(block.type === "Regular" && {
//             partNumber: block.partNumber,
//             productName: block.productName,
//             fmecaId: block.fmecaId,
//             fmDescription: block.fmDescription,
//             time: block.time,
//             repair: block.repair,
//             inspectionPeriod: block.inspectionPeriod,
//             dutyCycle: block.dutyCycle,
//             color: block.color,
//             frDistribution: block.frDistribution,
//             repairDistribution: block.repairDistribution,
//             load: block.load,
//             mct: block.mct,
//           }),
//           reliabilityData: block.reliabilityData || null
//         }));

//         return {
//           _id: new mongoose.Types.ObjectId(),
//           index: branchIdx,
//           name: nestedBranch.name || `Nested Branch ${branchIdx + 1}`,
//           blocks: formattedBlocks
//         };
//       });

//       const nestedParallelBlock = {
//         _id: new mongoose.Types.ObjectId(),
//         index: targetBranch.blocks?.length || 0,
//         blockId: req.body.blockId || Date.now(),
//         name: name || "Nested Parallel Section",
//         type: "Parallel Section",
//         elementType: "Parallel Section",
//         fr: null,
//         mtbf: null,
//         arrangement: arrangement || "horizontal",
//         k: k || 1,
//         n: n || branches.length,
//         branches: formattedNestedBranches,
//         isNested: true,
//         parentBranchId: branchId,
//         parentSectionId: ItemId,
//         reliabilityData: {
//           elementType: "Parallel Section",
//           isNestedParallel: true,
//           arrangement: arrangement || "horizontal",
//           k: k || 1,
//           n: n || branches.length,
//           parentBranchId: branchId,
//           parentSectionId: ItemId,
//           branchCount: branches.length
//         }
//       };

//       let updatedDocument;

//       if (location && location.includes('left')) {
//         updatedDocument = await ElementParameterData.findOneAndUpdate(
//           { "_id": ItemId, "branches._id": branchId },
//           {
//             "$push": {
//               "branches.$.blocks": {
//                 "$each": [nestedParallelBlock],
//                 "$position": 0
//               }
//             }
//           },
//           { new: true }
//         );
//       } else {
//         const nextIndex = targetBranch.blocks?.length > 0
//           ? Math.max(...targetBranch.blocks.map(b => b.index || 0)) + 1
//           : 0;
//         nestedParallelBlock.index = nextIndex;
//         updatedDocument = await ElementParameterData.findOneAndUpdate(
//           { "_id": ItemId, "branches._id": branchId },
//           { "$push": { "branches.$.blocks": nestedParallelBlock } },
//           { new: true }
//         );
//       }

//       if (updatedDocument) {
//         return res.status(200).json({
//           success: true,
//           message: `Nested parallel section added to branch`,
//           data: updatedDocument,
//           newBlock: nestedParallelBlock
//         });
//       }
//     }

//     // CASE 3: Create a new top-level parallel section
//     if (!branches || !Array.isArray(branches) || branches.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Branches data is required for new parallel section"
//       });
//     }

//     const formattedBranches = branches.map((branch, branchIdx) => {
//       let blocks = branch.blocks || [];
//       if (typeof blocks === "string") {
//         try {
//           blocks = JSON.parse(blocks);
//         } catch (err) {
//           blocks = [];
//         }
//       }

//       const formattedBlocks = blocks.map((block, blockIdx) => ({
//         _id: new mongoose.Types.ObjectId(),
//         index: blockIdx,
//         blockId: block.id || block.blockId || Date.now() + blockIdx,
//         name: block.name || `Block ${blockIdx + 1}`,
//         type: block.type || "Regular",
//         elementType: block.type || "Regular",
//         fr: block.fr ?? block.failureRate ?? 0.001,
//         mtbf: block.mtbf ?? 1000,
//         ...(block.type === "Regular" && {
//           partNumber: block.partNumber,
//           productName: block.productName,
//           fmecaId: block.fmecaId,
//           fmDescription: block.fmDescription,
//           time: block.time,
//           repair: block.repair,
//           inspectionPeriod: block.inspectionPeriod,
//           dutyCycle: block.dutyCycle,
//           color: block.color,
//           frDistribution: block.frDistribution,
//           repairDistribution: block.repairDistribution,
//           load: block.load,
//           mct: block.mct,
//         }),
//         reliabilityData: block.reliabilityData || null
//       }));

//       return {
//         _id: new mongoose.Types.ObjectId(),
//         index: branchIdx,
//         name: branch.name || `Branch ${branchIdx + 1}`,
//         blocks: formattedBlocks
//       };
//     });

//     const parallelSection = await ElementParameterData.create({
//       rbdId,
//       projectId,
//       companyId,
//       productId,
//       name: name || "Parallel Section",
//       type: "Parallel Section",
//       elementType: "Parallel Section",
//       arrangement: arrangement || "horizontal",
//       k: k || 1,
//       n: n || branches.length,
//       branches: formattedBranches,
//       isParallel: true
//     });

//     res.status(201).json({
//       success: true,
//       message: `Parallel Section created successfully with ${branches.length} branches`,
//       data: parallelSection
//     });

//   } catch (error) {
//     console.error("Parallel Section Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating/updating Parallel Section",
//       error: error.message
//     });
//   }
// };


// only working for nested parallel
// export const createParallelSection = async (req, res) => {
//   const { rbdId, projectId } = req.params;

//   try {
//     const {
//       companyId,
//       productId,
//       name,
//       arrangement,
//       k,
//       n,
//       branches,
//       data,
//       isNested,
//       parentId,
//       targetId,
//     } = req.body;

//     console.log(req.body, 'req.body')

//     if (parentId && targetId) {
//       const parentDocument = await ElementParameterData.findById(parentId);
//       if (!parentDocument) {
//         return res.status(404).json({ success: false, message: "Parent document not found" });
//       }

//       // First try: find a branch whose _id matches targetId directly
//       const findBranchById = (branches, targetBranchId, path = []) => {
//         for (let i = 0; i < branches.length; i++) {
//           const branch = branches[i];

//           if (branch._id.toString() === targetBranchId) {
//             return { found: true, containingBranch: branch, path };
//           }

//           // Go deeper into nested parallel sections
//           if (branch.blocks) {
//             for (let j = 0; j < branch.blocks.length; j++) {
//               const block = branch.blocks[j];
//               if (
//                 (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
//                 block.branches?.length > 0
//               ) {
//                 const result = findBranchById(
//                   block.branches,
//                   targetBranchId,
//                   [...path, { branchIndex: i, blockIndex: j }]
//                 );
//                 if (result.found) return result;
//               }
//             }
//           }
//         }
//         return { found: false };
//       };

//       // Second try: find a branch that CONTAINS a block with targetId (sibling insert)
//       const findBranchContainingBlock = (branches, targetBlockId, path = []) => {
//         for (let i = 0; i < branches.length; i++) {
//           const branch = branches[i];

//           if (branch.blocks && branch.blocks.length > 0) {
//             const blockExists = branch.blocks.some(
//               block => block._id.toString() === targetBlockId
//             );
//             if (blockExists) {
//               return { found: true, containingBranch: branch, path };
//             }

//             for (let j = 0; j < branch.blocks.length; j++) {
//               const block = branch.blocks[j];
//               if (
//                 (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
//                 block.branches?.length > 0
//               ) {
//                 const result = findBranchContainingBlock(
//                   block.branches,
//                   targetBlockId,
//                   [...path, { branchIndex: i, blockIndex: j }]
//                 );
//                 if (result.found) return result;
//               }
//             }
//           }
//         }
//         return { found: false };
//       };

//       // Try branch _id match first, then block _id match
//       let result = findBranchById(parentDocument.branches, targetId);
//       if (!result.found) {
//         result = findBranchContainingBlock(parentDocument.branches, targetId);
//       }

//       if (!result.found) {
//         return res.status(404).json({
//           success: false,
//           message: `No branch found for targetId: ${targetId}`
//         });
//       }

//       const { containingBranch, path } = result;
//       console.log('Found containing branch:', containingBranch._id);
//       console.log('Path:', JSON.stringify(path));

//       // Validate branches
//       if (!branches || !Array.isArray(branches) || branches.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Branches data is required for parallel section"
//         });
//       }

//       // Format nested branches
//       const formattedNestedBranches = branches.map((nestedBranch, branchIdx) => {
//         let blocks = nestedBranch.blocks || [];
//         if (typeof blocks === "string") {
//           try { blocks = JSON.parse(blocks); } catch { blocks = []; }
//         }

//         const formattedBlocks = blocks.map((block, blockIdx) => ({
//           _id: new mongoose.Types.ObjectId(),
//           index: blockIdx,
//           blockId: block.id || block.blockId || Date.now() + blockIdx,
//           name: block.name || `Block ${blockIdx + 1}`,
//           type: block.type || "Regular",
//           elementType: block.type || "Regular",
//           fr: block.fr ?? block.failureRate ?? 0.001,
//           mtbf: block.mtbf ?? 1000,
//           ...(block.type === "Regular" && {
//             partNumber: block.partNumber,
//             productName: block.productName,
//             fmecaId: block.fmecaId,
//             fmDescription: block.fmDescription,
//             time: block.time,
//             repair: block.repair,
//             inspectionPeriod: block.inspectionPeriod,
//             dutyCycle: block.dutyCycle,
//             color: block.color,
//             frDistribution: block.frDistribution,
//             repairDistribution: block.repairDistribution,
//             load: block.load,
//             mct: block.mct,
//           }),
//           reliabilityData: block.reliabilityData || null
//         }));

//         return {
//           _id: new mongoose.Types.ObjectId(),
//           index: branchIdx,
//           name: nestedBranch.name || `Branch ${branchIdx + 1}`,
//           blocks: formattedBlocks
//         };
//       });

//       const newParallelBlock = {
//         _id: new mongoose.Types.ObjectId(),
//         index: containingBranch.blocks.length,
//         blockId: req.body.blockId || Date.now(),
//         name: name || "Parallel Section",
//         type: "Parallel Section",
//         elementType: "Parallel Section",
//         fr: null,
//         mtbf: null,
//         arrangement: arrangement || "horizontal",
//         k: k || 1,
//         n: n || branches.length,
//         branches: formattedNestedBranches,
//         isNested: true,
//         parentBranchId: containingBranch._id,
//         parentSectionId: parentId,
//         reliabilityData: {
//           elementType: "Parallel Section",
//           isNestedParallel: true,
//           arrangement: arrangement || "horizontal",
//           k: k || 1,
//           n: n || branches.length,
//           parentBranchId: containingBranch._id,
//           parentSectionId: parentId,
//           branchCount: branches.length
//         }
//       };

//       // Build MongoDB update path
//       let pathString = "branches";
//       let arrayFilters = [];
//       let currentBranches = parentDocument.branches;

//       for (let idx = 0; idx < path.length; idx++) {
//         const seg = path[idx];
//         const actualBranch = currentBranches[seg.branchIndex];
//         const actualBlock = actualBranch.blocks[seg.blockIndex];

//         pathString += `.$[branch${idx}].blocks.$[block${idx}].branches`;
//         arrayFilters.push({ [`branch${idx}._id`]: new mongoose.Types.ObjectId(actualBranch._id) });
//         arrayFilters.push({ [`block${idx}._id`]: new mongoose.Types.ObjectId(actualBlock._id) });

//         currentBranches = actualBlock.branches;
//       }

//       pathString += `.$[targetBranch].blocks`;
//       arrayFilters.push({ "targetBranch._id": new mongoose.Types.ObjectId(containingBranch._id) });

//       console.log('Final path:', pathString);
//       console.log('Array filters:', JSON.stringify(arrayFilters, null, 2));

//       const updatedDocument = await ElementParameterData.findOneAndUpdate(
//         { "_id": parentId },
//         { "$push": { [pathString]: newParallelBlock } },
//         { arrayFilters, new: true }
//       );

//       if (!updatedDocument) throw new Error("Failed to add parallel section");

//       // Reindex blocks
//       const findUpdatedBranch = (branches) => {
//         for (const branch of branches) {
//           if (branch._id.toString() === containingBranch._id.toString()) return branch;
//           if (branch.blocks) {
//             for (const block of branch.blocks) {
//               if (
//                 (block.type === "Parallel Section" || block.elementType === "Parallel Section") &&
//                 block.branches
//               ) {
//                 const found = findUpdatedBranch(block.branches);
//                 if (found) return found;
//               }
//             }
//           }
//         }
//         return null;
//       };

//       const updatedBranch = findUpdatedBranch(updatedDocument.branches);

//       if (updatedBranch?.blocks) {
//         let reindexBasePath = "branches";
//         let reindexBaseFilters = [];
//         let reindexCurrentBranches = parentDocument.branches;

//         for (let idx = 0; idx < path.length; idx++) {
//           const seg = path[idx];
//           const actualBranch = reindexCurrentBranches[seg.branchIndex];
//           const actualBlock = actualBranch.blocks[seg.blockIndex];

//           reindexBasePath += `.$[branch${idx}].blocks.$[block${idx}].branches`;
//           reindexBaseFilters.push({ [`branch${idx}._id`]: new mongoose.Types.ObjectId(actualBranch._id) });
//           reindexBaseFilters.push({ [`block${idx}._id`]: new mongoose.Types.ObjectId(actualBlock._id) });

//           reindexCurrentBranches = actualBlock.branches;
//         }

//         await Promise.all(updatedBranch.blocks.map((block, idx) => {
//           return ElementParameterData.updateOne(
//             { "_id": parentId },
//             { "$set": { [reindexBasePath + `.$[targetBranch].blocks.${idx}.index`]: idx } },
//             { arrayFilters: [...reindexBaseFilters, { "targetBranch._id": new mongoose.Types.ObjectId(containingBranch._id) }] }
//           );
//         }));
//       }

//       const finalDocument = await ElementParameterData.findById(parentId);

//       return res.status(200).json({
//         success: true,
//         message: `Parallel section added to branch ${containingBranch._id}`,
//         data: finalDocument,
//         newBlock: newParallelBlock,
//         containingBranchId: containingBranch._id,
//         targetId
//       });
//     }

//     // ... rest of your existing code for other cases ...

//   } catch (error) {
//     console.error("Parallel Section Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating/updating Parallel Section",
//       error: error.message
//     });
//   }
// };


// working both parallel


export const createParallelSection = async (req, res) => {
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

    console.log(req.body, 'req.body');

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
      console.log('Found containing branch:', containingBranch._id);
      console.log('Path:', JSON.stringify(path));

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
            fr: block.fr ?? block.failureRate ?? 0.001,
            mtbf: block.mtbf ?? 1000,
            ...(block.type === "Regular" && {
              partNumber: block.partNumber,
              productName: block.productName,
              fmecaId: block.fmecaId,
              fmDescription: block.fmDescription,
              time: block.time,
              repair: block.repair,
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

      console.log('Final path:', pathString);
      console.log('Array filters:', JSON.stringify(arrayFilters, null, 2));

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
          fr: block.fr ?? block.failureRate ?? 0.001,
          mtbf: block.mtbf ?? 1000,
          ...(block.type === "Regular" && {
            partNumber: block.partNumber,
            productName: block.productName,
            fmecaId: block.fmecaId,
            fmDescription: block.fmDescription,
            time: block.time,
            repair: block.repair,
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

    const parallelSection = await ElementParameterData.create({
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
    });

    return res.status(201).json({
      success: true,
      message: `Parallel Section created successfully with ${branches.length} branches`,
      data: parallelSection
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
  console.log(id, 'id to delete')
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

  try {
    const { parentId, blockId } = req.params;

    console.log('Parent ID:', parentId);
    console.log('Block ID to delete:', blockId);

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
            console.log(`Found block ${targetBlockId} in branch`);
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
            console.log(`Branch became empty, removing it`);
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
      console.log('No branches left, deleting entire parent parallel section');
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
      console.log('Only one branch remains, converting parallel section to regular block');

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
          name: blockToConvert.name || modifiedSection.name || 'Regular Block',
          elementType: 'Regular',
          type: 'Regular',
          rbdId: modifiedSection.rbdId,
          projectId: modifiedSection.projectId,
          companyId: modifiedSection.companyId
        };
       console.log("regularBlockData...",regularBlockData)
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