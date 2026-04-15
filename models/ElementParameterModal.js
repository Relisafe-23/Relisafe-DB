import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define branchSchema first (since blockSchema will reference it)
const branchSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  index: Number,
  name: String,
  blocks: [Schema.Types.Mixed] // Will be populated with blockSchema after it's defined
});

// Define blockSchema that can contain branches
const blockSchema = new Schema({
  // Basic info
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  index: Number,
  blockId: Number, // UI block id
  name: String,
  type: String, // Regular | Parallel Section | K-out-of-N | SubSystem
  elementType: String, // Regular | K-out-of-N | SubRBD | Parallel Section

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

  // Parallel section specific fields (for nested parallel sections)
  arrangement: {
    type: String, // horizontal | vertical
    default: "horizontal"
  },
  isNested: {
    type: Boolean,
    default: false
  },
  parentBranchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RBDElementParameterData.branches"
  },
  parentSectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RBDElementParameterData"
  },

  // Nested branches - this allows parallel sections inside blocks
  branches: [branchSchema], // ✅ Reusing branchSchema

  // Other fields
  partNumber: String,
  productName: String,
  indexCount: String,
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

// Now update branchSchema to use blockSchema properly
branchSchema.add({
  blocks: [blockSchema] 
});

// Main element parameter schema
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
    components: [{
      lambda: Number,
      mu: Number,
      mttr: String,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: String,
      reliability: Number,
      unavailability: Number,
      isManual: Boolean
    }],
    
    

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

    // Parallel section branches - reuse branchSchema
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