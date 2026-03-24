import ElementParameterData from "../models/ElementParameterModal.js"
import mongoose from "mongoose";

export const createElementParameter = async (req, res) => {
  const data = req.body;
  const elementParameters = await ElementParameterData.create({
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
    type: data.blockType || data.type || "Regular",
  });
  res.status(201).json({
    success: true,
    data: elementParameters
  });

}

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

export const createParallelSection = async (req, res) => {
  const { rbdId, projectId } = req.params
 
  try {
    const {
      companyId,
      productId,
      name,
      arrangement,
      k,
      n,
      branches
    } = req.body;

    // Validation
    if (!branches || !Array.isArray(branches) || branches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Branches data is required"
      });
    }
    const formattedBranches = branches.map((branch) => {
      let blocks = branch.blocks || [];

      // If blocks came as string convert to array
      if (typeof blocks === "string") {
        try {
          blocks = JSON.parse(blocks);
        } catch (err) {
          blocks = [];
        }
      }

      const formattedBlocks = blocks.map((block, i) => ({
        index: i,
        blockId: block.id || null,
        name: block.name || "Block",
        type: block.type || "Regular",
        fr: block.failureRate ?? block.fr ?? null,
        mtbf: block.mtbf ?? null,
        reliabilityData: block.reliabilityData ?? null
      }));

      return {
        index: branch.index ?? 0,
        name: branch.name || `Branch ${branch.index + 1}`,
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
      arrangement,
      k,
      n,
      branches: formattedBranches
    });


    res.status(201).json({
      success: true,
      message: "Parallel Section created successfully",
      data: parallelSection
    });

  } catch (error) {

    console.error("Parallel Section Error:", error);

    res.status(500).json({
      success: false,
      message: "Error creating Parallel Section",
      error: error.message
    });

  }
};

export const deleteelementParameters = async (req, res) => {
  const id = req.params
  console.log(id, 'id to delete')
  const deleteBlock = await ElementParameterData.findByIdAndDelete(id.id)

  if (!deleteBlock) {
    console.log('No data')
  }

  res.status(201).json({
    success: true,
    message: 'Deleted Successfully'
  })
}

export const deleteNestedBlock = async (req, res) => {
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

    // Track if block was found and deleted
    let blockFound = false;
    let deletedBlockData = null;
    let branchDeleted = false;
    let parentDeleted = false;
    let convertedToRegular = false;

    // Filter branches - remove branches that become empty after block deletion
    const updatedBranches = [];

    parentSection.branches.forEach((branch, branchIndex) => {
      if (branch.blocks && branch.blocks.length > 0) {
        // Check if this branch contains the block to delete
        const blockToDelete = branch.blocks.find(block => block._id.toString() === blockId);
        
        if (blockToDelete) {
          blockFound = true;
          deletedBlockData = blockToDelete.toObject();

          // If branch has only this block, don't add the branch to updatedBranches (delete entire branch)
          if (branch.blocks.length === 1) {
            console.log(`Branch ${branchIndex} had only 1 block, deleting entire branch`);
            branchDeleted = true;
            // Skip adding this branch (branch will be deleted)
            return;
          } else {
            // Branch has multiple blocks, just remove this block
            const remainingBlocks = branch.blocks.filter(block => block._id.toString() !== blockId);
            updatedBranches.push({
              ...branch.toObject(),
              blocks: remainingBlocks
            });
          }
        } else {
          // Branch doesn't contain the block, keep it as is
          updatedBranches.push(branch);
        }
      }
    });

    if (!blockFound) {
      return res.status(404).json({
        success: false,
        message: 'Block not found in parallel section'
      });
    }

    // Check if there are any branches left
    if (updatedBranches.length === 0) {
      // No branches left, delete the entire parent parallel section
      console.log('No branches left, deleting entire parent parallel section');
      
      // Delete the parent document
      await ElementParameterData.findByIdAndDelete(parentId);
      parentDeleted = true;

      return res.status(200).json({
        success: true,
        data: {
          deletedBlock: deletedBlockData,
          branchDeleted: branchDeleted,
          parentDeleted: true,
          convertedToRegular: false
        },
        message: 'Parent parallel section deleted as it had no branches left'
      });
    }
    
    // Check if only ONE branch remains - convert to regular block
    else if (updatedBranches.length === 1) {
      console.log('Only one branch remains, converting parallel section to regular block');
      
      // Get the single remaining branch
      const remainingBranch = updatedBranches[0];
      
      // Get the first (and only) block from that branch
      const blockToConvert = remainingBranch.blocks && remainingBranch.blocks.length > 0 
        ? remainingBranch.blocks[0] 
        : null;
      
      if (blockToConvert) {
        // Create a new regular block with data from the parallel section and the block
        const regularBlockData = {
          // Take data from the block first, then fallback to parent section data
          indexCount: blockToConvert.indexCount || parentSection.indexCount || '',
          partNumber: blockToConvert.partNumber || parentSection.partNumber || '',
          productName: blockToConvert.productName || parentSection.productName || '',
          fr: blockToConvert.fr || parentSection.fr || 0,
          mtbf: blockToConvert.mtbf || parentSection.mtbf || 0,
          productId: blockToConvert.productId || parentSection.productId,
          fmecaId: blockToConvert.fmecaId || parentSection.fmecaId,
          fmDescription: blockToConvert.fmDescription || parentSection.fmDescription || '',
          time: blockToConvert.time || parentSection.time || 0,
          repair: blockToConvert.repair || parentSection.repair || 'Full repair',
          inspectionPeriod: blockToConvert.inspectionPeriod || parentSection.inspectionPeriod || '',
          dutyCycle: blockToConvert.dutyCycle || parentSection.dutyCycle || 100,
          color: blockToConvert.color || parentSection.color || '#ffffff',
          frDistribution: blockToConvert.frDistribution || parentSection.frDistribution || '',
          repairDistribution: blockToConvert.repairDistribution || parentSection.repairDistribution || 'Exponential',
          load: blockToConvert.load || parentSection.load || 100,
          mct: blockToConvert.mct || parentSection.mct || 0,
          name: blockToConvert.name || parentSection.name || 'Regular Block',
          elementType: 'Regular',
          type: 'Regular',
          rbdId: parentSection.rbdId,
          projectId: parentSection.projectId,
          companyId: parentSection.companyId
        };

        // Delete the old parallel section
        await ElementParameterData.findByIdAndDelete(parentId);
        
        // Create the new regular block
        const newRegularBlock = await ElementParameterData.create(regularBlockData);
        
        convertedToRegular = true;
        
        return res.status(200).json({
          success: true,
          data: {
            deletedBlock: deletedBlockData,
            convertedBlock: newRegularBlock,
            branchDeleted: branchDeleted,
            parentDeleted: true,
            convertedToRegular: true
          },
          message: 'Parallel section converted to regular block as only one branch remained'
        });
      }
    }

    // Update the branches with the filtered array
    parentSection.branches = updatedBranches;

    // Update the n (number of branches) count if a branch was deleted
    if (branchDeleted) {
      parentSection.n = updatedBranches.length;
      parentSection.branchCount = updatedBranches.length;
      
      // Adjust K if it's greater than new N
      if (parentSection.k > updatedBranches.length) {
        parentSection.k = updatedBranches.length;
      }
    }

    // Save the updated parent document
    await parentSection.save();

    res.status(200).json({
      success: true,
      data: {
        deletedBlock: deletedBlockData,
        branchDeleted: branchDeleted,
        parentDeleted: false,
        convertedToRegular: false,
        remainingBranches: updatedBranches.length,
        updatedK: parentSection.k,
        updatedN: parentSection.n
      },
      message: branchDeleted 
        ? 'Block and its empty branch deleted successfully' 
        : 'Nested block deleted successfully'
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

export const createKOfN = async(req,res)=>{
  const { rbdId, projectId } = req.params;
  console.log(rbdId,projectId,"hjgbkbgkbkv")
  try{
    const{
      k,
      n,
      lambda,
      mu,
      formula,
      effectiveLambda,
      effectiveMu,
      mtbf  
    } = req.body;
    console.log("data nmhhhh",body)
       if (!k || !n) {
      return res.status(400).json({
        success: false,
        message: "k and n are required"
      });
  }

  const KOfN = await KOfN.create({
    rbdId,
      projectId,
      k,
      n,
      lambda,
      mu,
      formula,
      effectiveLambda,
      effectiveMu,
      mtbf
  });
    res.status(201).json({
    success: true,
    data: KOfN 
  });
  } catch (error) {
    console.error("KOfN Error:", error);

    res.status(500).json({
      success: false,
      message: "Error creating KOfN",
      error: error.message
    });
  }
};