import mongoose from "mongoose";
const { Schema, model } = mongoose;

const mil472ProcedureSchema = new Schema({
  taskType: {
    type: String,
  },
  time: {
    type: String,
  },
  totalLabour: {
    type: String,
  },
  skill: {
    type: String,
  },
  tools: {
    type: String,
  },
  partNo: {
    type: String,
  },
  toolType: {
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
  mttrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mttrPrediction",
  },
});

mil472ProcedureSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

mil472ProcedureSchema.set("autoIndex", true);

const mill472Procedure = model("Mill472Procedure", mil472ProcedureSchema);

export default mill472Procedure;
