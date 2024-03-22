import mongoose from "mongoose";
const { Schema, model } = mongoose;

const assemblySchema = new Schema({
  productName: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Electronic", " Mechanical", "Assembly"],
    default: "Assembly",
  },
  // type: String,
  // enum: ["Open", "OnReview", "ReviewCompleted"],
  // default: "Open",
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
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectCreation",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  parentId: {
    type: String,
  },
});

assemblySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

assemblySchema.set("autoIndex", true);

const assembly = model("Assembly", assemblySchema);

export default assembly;
