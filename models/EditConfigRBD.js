import mongoose from "mongoose";
const { Schema, model } = mongoose;

const rbdConfigSchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // rbdId: {
  //   type: String,
  //   required: true
  // },
  rbdTitle: {
    type: String,
    default: ''
  },
  missionTime: {
    type: Number,
    default: 1,
    min: 0.1
  },
 
  description: {
    type: String,
 
  },
//   upperFont: fontSettingsSchema,
//   lowerFont: fontSettingsSchema,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
rbdConfigSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
rbdConfigSchema.set("autoIndex", true);

const rbdConfig = model("RBDConfig", rbdConfigSchema);

export default rbdConfig;