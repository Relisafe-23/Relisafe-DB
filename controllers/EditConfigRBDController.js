import EditConfigRBD from '../models/EditConfigRBD.js';

// export const getRBDConfig = async (req, res) => {
//   try {
//     const { projectId, rbdId } = req.query;

//     if (!projectId) {
//       return res.status(400).json({
//         success: false,
//         message: 'projectId is required'
//       });
//     }

//     let query = { projectId };
//     if (rbdId) {
//       query.rbdId = rbdId;
//     }

//     const config = await  EditConfigRBD.findOne(query)
//       .populate('createdBy', 'name email')
//       .populate('updatedBy', 'name email');

//     if (!config) {
//       // Return default configuration if not found
//       return res.status(200).json({
//         success: true,
//         data: {
//           rbdTitle: '',
//           missionTime: 1,
//           displayUpper: 'Reference designator',
//           displayLower: 'FR parameter1',
//           printRemarks: 'Yes',
//           upperFont: {
//             fontFamily: 'Arial',
//             fontSize: 12,
//             fontWeight: 'normal',
//             fontColor: '#000000'
//           },
//           lowerFont: {
//             fontFamily: 'Arial',
//             fontSize: 12,
//             fontWeight: 'normal',
//             fontColor: '#000000'
//           }
//         }
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: config
//     });
//   } catch (error) {
//     console.error('Error in getRBDConfig:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch RBD configuration',
//       error: error.message
//     });
//   }
// };

export const createRBDConfig = async (req,res) =>{
  const data = req.body;
  console.log(data,"data...")
  const editRBD = await EditConfigRBD.create({
    projectId: data.projectId,
       rbdTitle:data.rbdTitle,
       missionTime:data.missionTime,
        description:data.description,
      
        //  printRemarks:data.printRemarks
  })
  console.log("editRBD",editRBD)
    res.status(201).json({
      success: true,
      data: data
    });

  } 
export const updatedConfig = async (req,res)=>{
    const data = req.body;
  console.log(data,"data...")
  const editRBD = await EditConfigRBD.findByIdAndUpdat({
    projectId: data.projectId,
       rbdTitle:data.rbdTitle,
       missionTime:data.missionTime,
        description:data.description,
      
        //  printRemarks:data.printRemarks
  })
  console.log("editRBD",editRBD)
    res.status(201).json({
      success: true,
      data: data
    });
}

export const getRBDConfig = async (req, res) => {
  try {
    console.log("get...");

    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "projectId is required",
      });
    }

    const RBDConfig = await EditConfigRBD.find({ projectId });

    res.status(200).json({
      success: true,
      count: RBDConfig.length,
      data: RBDConfig,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

// export const createRBDConfig = async (req, res) => {
//   try {
//     const { 
//       projectId, 
//       rbdId, 
//       rbdTitle, 
//       missionTime, 
//       displayUpper, 
//       displayLower, 
//       printRemarks,
//       upperFont,
//       lowerFont 
//     } = req.body;
    
//     const userId = req.user?.id; // Assuming you have user authentication

//     // Check if configuration already exists
//     const existingConfig = await RBDConfig.findOne({ projectId, rbdId });
    
//     if (existingConfig) {
//       return res.status(409).json({
//         success: false,
//         message: 'Configuration already exists for this project and RBD'
//       });
//     }

//     const newConfig = new EditConfigRBD({
//       projectId,
//       rbdId,
//       rbdTitle,
//       missionTime: missionTime || 1,
//       displayUpper: displayUpper || 'Reference designator',
//       displayLower: displayLower || 'FR parameter1',
//       printRemarks: printRemarks || 'Yes',
//       upperFont: upperFont || {
//         fontFamily: 'Arial',
//         fontSize: 12,
//         fontWeight: 'normal',
//         fontColor: '#000000'
//       },
//       lowerFont: lowerFont || {
//         fontFamily: 'Arial',
//         fontSize: 12,
//         fontWeight: 'normal',
//         fontColor: '#000000'
//       },
//       createdBy: userId,
//       updatedBy: userId
//     });

//     await newConfig.save();

//     res.status(201).json({
//       success: true,
//       message: 'RBD configuration created successfully',
//       data: newConfig
//     });
//   } catch (error) {
//     console.error('Error in createRBDConfig:', error);
    
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: 'Configuration with this projectId and rbdId already exists'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Failed to create RBD configuration',
//       error: error.message
//     });
//   }
// };


export const updateRBDConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user?.id;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.createdBy;
    delete updateData.projectId; // Don't allow projectId to be updated
    delete updateData.rbdId; // Don't allow rbdId to be updated

    const updatedConfig = await RBDConfig.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: userId,
        updatedAt: Date.now()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    if (!updatedConfig) {
      return res.status(404).json({
        success: false,
        message: 'RBD configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'RBD configuration updated successfully',
      data: updatedConfig
    });
  } catch (error) {
    console.error('Error in updateRBDConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update RBD configuration',
      error: error.message
    });
  }
};


export const saveRBDConfig = async (req, res) => {
  try {
    const { 
      projectId, 
      rbdId, 
      rbdTitle, 
      missionTime, 
      displayUpper, 
      displayLower, 
      printRemarks,
      upperFont,
      lowerFont 
    } = req.body;
    
    const userId = req.user?.id;

    if (!projectId || !rbdId) {
      return res.status(400).json({
        success: false,
        message: 'projectId and rbdId are required'
      });
    }

    const config = await RBDConfig.findOneAndUpdate(
      { projectId, rbdId },
      {
        projectId,
        rbdId,
        rbdTitle,
        missionTime: missionTime || 1,
        displayUpper: displayUpper || 'Reference designator',
        displayLower: displayLower || 'FR parameter1',
        printRemarks: printRemarks || 'Yes',
        upperFont: upperFont || {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'normal',
          fontColor: '#000000'
        },
        lowerFont: lowerFont || {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'normal',
          fontColor: '#000000'
        },
        updatedBy: userId,
        updatedAt: Date.now(),
        $setOnInsert: { createdBy: userId }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'RBD configuration saved successfully',
      data: config
    });
  } catch (error) {
    console.error('Error in saveRBDConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save RBD configuration',
      error: error.message
    });
  }
};


export const deleteRBDConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedConfig = await RBDConfig.findByIdAndDelete(id);

    if (!deletedConfig) {
      return res.status(404).json({
        success: false,
        message: 'RBD configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'RBD configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRBDConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete RBD configuration',
      error: error.message
    });
  }
};

export const getAllRBDConfigs = async (req, res) => {
  try {
    const { projectId } = req.query;
    const { page = 1, limit = 10, search } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'projectId is required'
      });
    }

    const query = { projectId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { rbdTitle: { $regex: search, $options: 'i' } },
        { rbdId: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const configs = await RBDConfig.find(query)
      .sort({ createdAt: -1 })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    const total = await RBDConfig.countDocuments(query);

    res.status(200).json({
      success: true,
      data: configs,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllRBDConfigs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RBD configurations',
      error: error.message
    });
  }
};

export const updateFontSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, fontSettings } = req.body;
    const userId = req.user?.id;

    if (!type || !['upper', 'lower'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Valid font type (upper or lower) is required'
      });
    }

    const updateField = type === 'upper' ? 'upperFont' : 'lowerFont';

    const updatedConfig = await  EditConfigRBD.findByIdAndUpdate(
      id,
      {
        [updateField]: fontSettings,
        updatedBy: userId,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({
        success: false,
        message: 'RBD configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${type} font settings updated successfully`,
      data: updatedConfig[updateField]
    });
  } catch (error) {
    console.error('Error in updateFontSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update font settings',
      error: error.message
    });
  }
};