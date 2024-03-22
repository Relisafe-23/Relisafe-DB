import mongoose from "mongoose";
const { Schema, model } = mongoose;

const projectPermissionSchema = new Schema({
  modules: {
    // enum: [
    //   "PBS",
    //   "Failure Rate Prediction",
    //   "MTTR Prediction",
    //   "FMECA",
    //   "RBD",
    //   "FTA",
    //   "PM MRA",
    //   "Spare Part Analysis",
    // ],
    type: Object,
  },
  accessType: {
    enum: ["Read", "Write"],
    type: String,
    default: "Read",
  },
  authorizedPersonnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  modefiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

projectPermissionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

projectPermissionSchema.set("autoIndex", true);

const projectPermission = model("projectPermission", projectPermissionSchema);

export default projectPermission;
