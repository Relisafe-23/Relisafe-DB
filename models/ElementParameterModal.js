import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Updated blockSchema with all regular block fields
const blockSchema = new Schema({
  // Basic info
  index: Number,
  blockId: Number, // UI block id (important later)
  name: String,
  type: String, // Regular | SubSystem | K-out-of-N
  elementType: String, // Regular | K-out-of-N | SubRBD
  
  // Reliability parameters
  mtbf: Number,
  fr: Number,
  time: Number,
  
  // K-of-N parameters
  k: Number,
  n: Number,
  reliability: Number,
  unavailability: Number,
   lambda: Number,
   mu: Number,
   mttr: Number,
   productId: String,
  // Product details
  partNumber: String,
  productName: String,
  indexCount: String,
  
  // FMECA data
  fmecaId: Number,
  fmDescription: String,
  
  // Repair parameters
  repair: String,
  inspectionPeriod: String,
  dutyCycle: Number,
  
  // Visual parameters
  color: String,
  
  // Distribution parameters
  frDistribution: String,
  repairDistribution: String,
  
  // Load parameters
  load: Number,
  mct: Number,
  
  // References
  rbdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RBDConfig",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  
  // Additional data
  reliabilityData: Schema.Types.Mixed
});

const branchSchema = new Schema({
  index: Number,
  name: String,
  blocks: [blockSchema]
});

const elementParameterSchema = new Schema(
  {
    // RBD relation
    rbdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RBDConfig",
    },
    indexCount: String,
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    // Element Info
    type: {
      type: String, // Regular | Parallel Section | K-of-N
    },
    elementType: {
      type: String, // Regular | Parallel Section | Parallel Branch
    },
    name: {
      type: String
    },

    // Section identification
    sectionId: Number,
    parentSection: Number,
    branchIndex: Number,
    isParallel: {
      type: Boolean,
      default: false
    },
    isParallelBranch: {
      type: Boolean,
      default: false
    },
    branchCount: Number,
    arrangement: {
      type: String // horizontal | vertical
    },

    // Reliability parameters
    fr: Number,
    mtbf: Number,
    time: Number,

    // K-of-N parameters
    k: Number,
    n: Number,

    reliability: Number,
    unavailability: Number,
    lambda: Number,
    mu: Number,
    mttr: Number,

 kOfNType: {
      type: String,
      enum: ['Identical', 'Non-Identical', 'Identical (Load Sharing)'],
      default: 'Identical'
    },
    
    // For Non-Identical K-out-of-N (store components if needed)
    // components: [{
    //   lambda: Number,
    //   mu: Number,
    //   mttr: String,
    //   productId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    //   productName: String,
    //   reliability: Number,
    //   unavailability: Number,
    //   isManual: Boolean
    // }],
    
    

    // Product details
    partNumber: String,
    productName: String,

    // FMECA data
    fmecaId: Number,
    fmDescription: String,

    repair: String,
    inspectionPeriod: String,
    dutyCycle: Number,
    color: String,
    frDistribution: String,
    repairDistribution: String,
    load: Number,
    mct: Number,

    // Parallel section branches
    branches: [branchSchema],

  },
  { timestamps: true }
);

elementParameterSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const ElementParameterData = model(
  "RBDElementParameterData",
  elementParameterSchema
);

export default ElementParameterData;