import mongoose from "mongoose";

const { Schema, model } = mongoose;

const elementParameterSchema = new Schema(
  {
    indexCount: {
      type: Number,
    },

    partNumber: {
      type: String,
    },

    productName: {
      type: String,
    },

    fr: {
      type: Number,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    fmecaId: {
    type: Number,
  
    },

    fmDescription: {
      type: String,
    },

    elementType: {
      type: String,
    },

    time: {
      type: Number,
    },

    repair: {
      type: String,
    },

    inspectionPeriod: {
      type: String,
    },

    dutyCycle: {
      type: Number,
    },

    color: {
      type: String,
    },

    frDistribution: {
      type: String,
    },

    k: {
      type: Number,
    },

    n: {
      type: Number,
    },

    repairDistribution: {
      type: String,
    },

    load: {
      type: Number,
    },

    mct: {
      type: Number,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

// Clean JSON output
elementParameterSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

elementParameterSchema.set("autoIndex", true);

const ElementParameterData = model(
  "RBDElementParameterData",
  elementParameterSchema
);

export default ElementParameterData;