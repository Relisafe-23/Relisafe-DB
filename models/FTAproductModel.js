import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FTAproductSchema = new Schema({
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
  status: {
    type: String,
  },
  calcTypes: {
    type: String,
  },
  missionTime: {
    type: String,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  parentId: {
    type: String,
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
  isProducts: {
    type: String,
  },
});

FTAproductSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

FTAproductSchema.set("autoIndex", true);

const FTAproduct = model("FTAproduct", FTAproductSchema);

export default FTAproduct;
