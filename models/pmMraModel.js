import mongoose from "mongoose";
const { Schema, model } = mongoose;

const pmMraSchema = new Schema({
  name: {
    type: String,
  },
  failureMode: {
    type: String,
  },
  partNumber: {
    type: String,
  },
  category: {
    type: String,
  },
  quantity: {
    type: String,
  },
  partType: {
    type: String,
  },
  repairable: {
    type: String,
  },
  levelOfRepair: {
    type: String,
  },
  levelOfReplace:{
    type: String,
  },
  spare: { 
    type: String,
  },
  endEffect:{
    type: String,
  },
  safetyImpact:{
    type: String,
  },
  reliabilityImpact: {
    type: String,
  },
  frequency: {
    type: String,
  },
  severity:{
    type: String,
  },
  riskIndex: {
    type: String,
  },
  LossOfEvident: {
    type: String,
  },
  criticalityAccept: {
    type: String,
  },
  significantItem: {
    type: String,
  },
  LubricationservceTsk: {
    type: String,
  },
  conditionMonitrTsk: {
    type: String,
  },
  restoreDiscrdTsk: {
    type: String,
  },
  failureFindTsk: {
    type: String,
  },
  combinationOfTsk: {
    type: String,
  },
  reDesign: {
    type: String,
  },
  rcmNotes: {
    type: String,
  },
  pmTaskId: {
    type: String,
  },
  pmTaskType: {
    type: String,
  },
  taskIntrvlFreq: {
    type: String,
  },
  taskIntrvlUnit: {
    type: String,
  },
  LatitudeFreqTolrnc: {
    type: String,
  },
  scheduleMaintenceTsk: {
    type: String,
  },
  tskInteralDetermination: {
    type: String,
  },
  taskDesc: {
    type: String,
  },
  tskTimeML1: {
    type: String,
  },
  tskTimeML2: {
    type: String,
  },
  tskTimeML3: {
    type: String,
  },
  tskTimeML4: {
    type: String,
  },
  tskTimeML5: {
    type: String,
  },
  tskTimeML6: {
    type: String,
  },
  tskTimeML7: {
    type: String,
  },
  skill1: {
    type: String,
  },
  skillOneNos: {
    type: String,
  },
  skillOneContribution: {
    type: String,
  },
  skill2: {
    type: String,
  },
  skillTwoNos: {
    type: String,
  },
  skillTwoContribution: {
    type: String,
  },
  skill3: {
    type: String,
  },
  skillThreeNos: {
    type: String,
  },
  skillThreeContribution: {
    type: String,
  },
  addiReplaceSpare1: {
    type: String,
  },
  addiReplaceSpare1Qty: {
    type: String,
  },
  addiReplaceSpare2: {
    type: String,
  },
  addiReplaceSpare2Qty: {
    type: String,
  },
  addiReplaceSpare3: {
    type: String,
  },
  addiReplaceSpare3Qty: {
    type: String,
  },
  consumable1: {
    type: String,
  },
  consumable1Qty: {
    type: String,
  },
  consumable2: {
    type: String,
  },
  consumable2Qty: {
    type: String,
  },
  consumable3: {
    type: String,
  },
  consumable3Qty: {
    type: String,
  },
  consumable4: {
    type: String,
  },
  consumable4Qty: {
    type: String,
  },
  consumable5: {
    type: String,
  },
  consumable5Qty: {
    type: String,
  },
  userField1: {
    type: String,
  },
  userField2: {
    type: String,
  },
  userField3: {
    type: String,
  },
  userField4: {
    type: String,
  },
  userField5: {
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
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

pmMraSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

pmMraSchema.set("autoIndex", true);

const pmMra = model("pmMra", pmMraSchema);

export default pmMra;
