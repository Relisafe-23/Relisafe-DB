import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productBreakdownStructureSchema = new Schema({
  productName: {
    type: String,
  },
  category: {
    type: String,
    // enum: ["Electronic", " Mechanical", "Assembly"],
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

  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product",
  // },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  assemblyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assembly",
  },
  electronicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Electronical",
  },
  mechanicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mechanical",
  },
});

productBreakdownStructureSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productBreakdownStructureSchema.set("autoIndex", true);

const productBreakdownStructure = model("ProductBreakdownStructure", productBreakdownStructureSchema);

export default productBreakdownStructure;
