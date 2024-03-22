import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productTreeStructureSchema = new Schema({
  productName: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Electronic", " Mechanical", "Assembly"],
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
  treeStructure: {
    type: Object,
  },
  fr: {
    type: String,
  },
  mttr: {
    type: String,
  },
  mct: {
    type: String,
  },
  mlh: {
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
  parentId:{
    type:String,
  }
});

productTreeStructureSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productTreeStructureSchema.set("autoIndex", true);

const productTreeStructure = model("ProductTreeStructure", productTreeStructureSchema);

export default productTreeStructure;
