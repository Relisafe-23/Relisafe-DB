import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sparePartsAnalysisSchema = new Schema({
  spare: {
    type: String,
  },
  recommendedSpare: {
    type: String,
  },
  warrantySpare: {
    type: String,
  },
  deliveryTimeDays: {
    type: Number,
  },
  afterSerialProductionPrice1: {
    type: String,
  },
  price1MOQ: {
    type: String,
  },
  afterSerialProductionPrice2: {
    type: String,
  },
  price2MOQ: {
    type: String,
  },
  afterSerialProductionPrice3: {
    type: String,
  },
  price3MOQ: {
    type: String,
  },
  annualPriceEscalationPercentage: {
    type: String,
  },
  lccPriceValidity: {
    type: String,
  },
  recommendedSpareQuantity: {
    type: String,
  },
  calculatedSpareQuantity: {
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

sparePartsAnalysisSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

sparePartsAnalysisSchema.set("autoIndex", true);

const sparePartsAnalysis = model(
  "sparePartsAnalysis",
  sparePartsAnalysisSchema
);

export default sparePartsAnalysis;
