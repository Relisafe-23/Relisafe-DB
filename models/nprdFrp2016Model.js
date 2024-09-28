import mongoose from "mongoose";
const { Schema, model } = mongoose;

const nprdFrp2016Schema = new Schema(
  {
    partTypeId: {
      type: Number,
    },
    partDescrId: {
      type: Number,
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
    fr: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Custom method to modify the JSON output
nprdFrp2016Schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id; // Convert _id to id
  return object;
});

nprdFrp2016Schema.set("autoIndex", true); // Automatically create indexes

// Creating the Mongoose model
const nprdFrpData = model("nprdFrpData", nprdFrp2016Schema);

export default nprdFrpData;
