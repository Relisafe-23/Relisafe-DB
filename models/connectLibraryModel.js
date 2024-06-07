import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectLibrarySchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectCreation",
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
  sourceName:{
    type: String,
  },
  sourceValue:{
    type: String,
  }, 
  destinationModule:{
    type: String,
  },
  destinationId:{
    type: mongoose.Schema.Types.ObjectId,
  },
  destinationName:{
    type: String,
  },
  destinationValue:{
    type: String,
  },
});

connectLibrarySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

connectLibrarySchema.set("autoIndex", true);

const connectLibrary = model("ConnectLibrary", connectLibrarySchema);

export default connectLibrary;
