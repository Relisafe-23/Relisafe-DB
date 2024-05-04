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
  operatingPhase: {
    type: String,
  },
  function: {
    type: String,
  },
  failureMode: {
    type: String,
  },
  // searchFM: {
  //   type: String,
  // },
  failureModeRatioAlpha: {
    type: String,
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

SafetySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

SafetySchema.set("autoIndex", true);

const Safety = model("Safety", SafetySchema);

export default Safety;
