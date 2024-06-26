import mongoose from "mongoose";
const { Schema, model } = mongoose;

const nprdPartDesc2016Schema = new Schema({
  partTypeId: {
    type: String,
  },
  partDescrId:{
    type: String,
  },
  partDescrFull: {
    type: String,
  },
  partType: {
    type: String,
  },  
});
nprdPartDesc2016Schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

nprdPartDesc2016Schema.set("autoIndex", true);

const nprdPartDesc = model("nprdPartDesc", nprdPartDesc2016Schema);

export default nprdPartDesc;
