import mongoose from "mongoose";
const { Schema, model } = mongoose;

const FMECASchema = new Schema({
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
  fmecaId:{
    type: Number,
  },
  operatingPhase: {
    type: String,
  },
  function: {
    type: String,
  },
  failureMode: {
    type: String,
  },
  searchFM: {
    type: String,
  },
  failureModeRatioAlpha: {
    type: Number,
  },
  cause: {
    type: String,
  },
  detectableMeansDuringOperation: {
    type: String,
  },
  detectableMeansToMaintainer: {
    type: String,
  },
  BuiltInTest: {
    type: String,
  },
  subSystemEffect: {
    type: String,
  },
  systemEffect: {
    type: String,
  },
  endEffect: {
    type: String,
  },
  endEffectRatioBeta: {
    type: String,
  },
  safetyImpact: {
    type: String,
  },
  referenceHazardId: {
    type: String,
  },
  realibilityImpact: {
    type: String,
  },
  serviceDisruptionTime: {
    type: String,
  },

  frequency: {
    type: String,
  },
  severity: {
    type: String,
  },
  riskIndex: {
    type: String,
  },
  designControl: {
    type: String,
  },
  maintenanceControl: {
    type: String,
  },
  exportConstraints: {
    type: String,
  },
  immediteActionDuringNonOperationalPhase: {
    type: String,
  },
  immediteActionDuringOperationalPhase: {
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
  userField6: {
    type: String,
  },
  userField7: {
    type: String,
  },
  userField8: {
    type: String,
  },
  userField9: {
    type: String,
  },
  userField10: {
    type: String,
  },
});

FMECASchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

FMECASchema.set("autoIndex", true);

const FMECA = model("FMECA", FMECASchema);

export default FMECA;
