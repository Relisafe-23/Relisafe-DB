import mongoose from "mongoose";
const { Schema, model } = mongoose;
const separateLibrarySchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectCreation,",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Libraries",
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  sourceName: {
    type: String,
  },
  sourceValue: {
    type: String,
  },
  moduleName: {
    type: String,
  },
});
separateLibrarySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
separateLibrarySchema.set("autoIndex", true);
const separateLibrary = model("SeparateLibrary", separateLibrarySchema);
export default separateLibrary;