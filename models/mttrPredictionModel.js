import mongoose from "mongoose";
const { Schema, model } = mongoose;

const mttrPredictionSchema = new Schema({
  repairable: {
  
    type: String,
  },
  levelOfReplace: {
  
    type: String,
  },
  levelOfRepair: {
   
    type: String,
  },
  spare: {
   
    type: String,
  },
  mct: {
    type: String,
  },
  mlh: {
    type: String,
  },
  totalLabourHr: {
    type: String,
  },
  mMax: {
    type: String,
  },
  mttr: {
    type: String,
  },
  remarks: {
    type: String,
  },
  taskType: {
    type: String,
  },
  time: {
    type: String,
  },
  noOfLabours: {
    type: String,
  },
  skills: {
    type: String,
  },
  tools: {
    type: String,
  },
  toolsPartNo: {
    type: String,
  },
  toolType: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

mttrPredictionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

mttrPredictionSchema.set("autoIndex", true);

const mttrPredcition = model("mttrPrediction", mttrPredictionSchema);

export default mttrPredcition;
