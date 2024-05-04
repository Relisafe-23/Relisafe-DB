import mongoose from "mongoose";
const { Schema, model } = mongoose;

const nprdPartType2016Schema = new Schema({
  partTypeId: {
    type: String,
  },
  partType:{
    type: String,
  },
  ramCPartType: {
    type: String,
  },
  ramCFamilyCode: {
    type: String,
  },  
  ramCItemCode: {
    type: String,
  },  
});
nprdPartType2016Schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

nprdPartType2016Schema.set("autoIndex", true);

const nprdPartType = model("nprdPartType", nprdPartType2016Schema);

export default nprdPartType;
