import mongoose from "mongoose";
const { Schema, model } = mongoose;

const nprdFrp2016Schema = new Schema({
  partTypeId: {
    type: String,
  },
  partDescrId:{
    type: String,
  },
  partDescrFull: {
    type: String,
  },
  quality: {
    type: String,
  },
  environment: {
    type: String,
  },
  partTypeTxt: {
    type: String,
  },  
});
nprdFrp2016Schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

nprdFrp2016Schema.set("autoIndex", true);

const nprdFrpData = model("nprdFrpData", nprdFrp2016Schema);

export default nprdFrpData;
