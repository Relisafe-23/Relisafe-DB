import mongoose from "mongoose";
const { Schema, model } = mongoose;

const projectCreationSchema = new Schema({
  projectName: {
    type: String,
  },
  projectDesc: {
    type: String,
  },
  projectNumber: {
    type: String,
  },
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customerName: {
    type: String,
  },
  operationalPhase: {
    type: String,
  },
  productLifeYears: {
    type: String,
  },
  productLifekm: {
    type: String,
  },
  productLifeMiles: {
    type: String,
  },
  productLifeOperationCycle: {
    type: String,
  },

  daysOperationPerYear: {
    type: String,
  },

  avgOperationalHrsPerDay: {
    type: String,
  },
  avgPowerHrsPerDay: {
    type: String,
  },
  avgCyclePerOperationalHrs: {
    type: String,
  },
  avgCyclePerPowerOnHrs: {
    type: String,
  },
  avgAnnualOperationalHrs: {
    type: String,
  },
  avgAnnualPowerOnHrs: {
    type: String,
  },
  avgAnnualMileageKm: {
    type: String,
  },

  avgAnnualMileageInMiles: {
    type: String,
  },
  avgAnnualOperationCycles: {
    type: String,
  },
  avgAnnualPowerOnCycles: {
    type: String,
  },
  avgSpeedKm: {
    type: String,
  },
  avgSpeedMiles: {
    type: String,
  },
  frTarget: {
    type: String,
  },
  frUnit: {
    type: String,
  },
  currency: {
    type: String,
  },
  priceValidity: {
    type: String,
  },
  deliveryTerms: {
    type: String,
  },
  deliveryLocation: {
    type: String,
  },
  environment: {
    type: String,
  },
  temperature: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  isOwner: {
    Boolean: false,
  },
  nonShortProbability: {
    type: Number,
  },
  mMaxValue: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

projectCreationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

projectCreationSchema.set("autoIndex", true);

const project = model("Project", projectCreationSchema);

export default project;
