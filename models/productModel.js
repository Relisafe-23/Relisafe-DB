import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
  },
  category: {
    type: String,
  },
  reference: {
    type: String,
  },
  partType: {
    type: String,
  },
  partNumber: {
    type: String,
  },
  quantity: {
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
});

productSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productSchema.set("autoIndex", true);

const product = model("Product", productSchema);

export default product;
