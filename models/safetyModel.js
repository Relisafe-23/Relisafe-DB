import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SafetySchema = new Schema({
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
  modeOfOperation: {
    type: String,
  },
  hazardCause: {
    type: String,
  },
  effectOfHazard: {
    type: String,
  },
  hazardClasification: {
    type: String,
  },
  designAssuranceLevel: {
    type: String,
  },
  meansOfDetection: {
    type: String,
  },
  crewResponse: {
    type: String,
  },
  uniqueHazardIdentifier: {
    type: String,
  },
  initialSeverity: {
    type: String,
  },
  initialLikelihood: {
    type: String,
  },
  initialRiskLevel: {
    type: String,
  },
  designMitigation: {
    type: String,
  },
  designMitigatonResbiity: {
    type: String,
  },
  designMitigtonEvidence: {
    type: String,
  },
  opernalMaintanMitigation: {
    type: String,
  },
  opernalMitigatonResbility: {
    type: String,
  },

  operatnalMitigationEvidence: {
    type: String,
  },
  residualSeverity: {
    type: String,
  },
  residualLikelihood: {
    type: String,
  },
  residualRiskLevel: {
    type: String,
  },
  hazardStatus: {
    type: String,
  },
  ftaNameId: {
    type: String,
  },
  userField1: {
    type: String,
  },
  userField2: {
    type: String,
  },
});

SafetySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

SafetySchema.set("autoIndex", true);

const Safety = model("Safety", SafetySchema);

export default Safety;
