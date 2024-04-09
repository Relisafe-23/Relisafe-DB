import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FTAtreeSchema = new Schema({
  gateType: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  gateId: {
    type: String,
  },
  treeStructure: {
    type: Object,
  },
  status: {
    type: String,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  calcTypes: {
    type: String,
  },
  missionTime: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalGateId: {
    type: Number,
  },
  isEvent: {
    type: Boolean,
  },
  isP: {
    type: String,
  },
  isT: {
    type: String,
  },
  eventMissionTime: {
    type: String,
  },
  mttr: {
    type: String,
  },
  fr: {
    type: String,
  },
});

FTAtreeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

FTAtreeSchema.set("autoIndex", true);

const FTAtreeData = model("FTAtreeData", FTAtreeSchema);

export default FTAtreeData;
