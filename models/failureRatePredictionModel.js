import mongoose from "mongoose";
const { Schema, model } = mongoose;

const failureRatePredictionSchema = new Schema({
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
  treeStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductTreeStructure",
  },
  predicted: {
    type: String,
  },
  field: {
    type: String,
  },
  dutyCycle: {
    type: String,
  },
  otherFr: {
    type: String,
  },
  frDistribution: {
    type: String,
  },
  allocated: {
    type: String,
  },
  frRemarks: {
    type: String,
  },
  failureRateOffset: {
    type: String,
  },
  frOffsetOperand: {
    type: String,
  },
  standard: {
    type: String,
  },
  frpRate: {
    type: String,
  },
  frUnit: {
    type: String,
  },
  source:{
    type: String
  }
});

failureRatePredictionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

failureRatePredictionSchema.set("autoIndex", true);

const failureRatePrediction = model("FailureRatePrediction", failureRatePredictionSchema);

export default failureRatePrediction;
