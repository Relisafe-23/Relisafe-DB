import mongoose from "mongoose";
const { Schema, model } = mongoose;

const librarySchema = new Schema({
  projectId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectCreation,"
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  moduleName: {
    type: String,
  },
  moduleData: [
    {
      key: String,
      name: String,
    },
  ],
});

librarySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

librarySchema.set("autoIndex", true);

const libraries = model("Libraries", librarySchema);

export default libraries;
