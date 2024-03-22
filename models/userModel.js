import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  name: {
    type: String,
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  },
  sessionId: {
    type: String,
  },
  role: {
    type: String,
  },
  phone: {
    type: String,
  },
  companyName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  isSuperAdminCreated: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  userThemeColor: {
    type: String,
  },
});

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

userSchema.set("autoIndex", true);

const user = model("User", userSchema);

export default user;
