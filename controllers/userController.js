import User from "../models/userModel.js";
import Company from "../models/companyModel.js";
import {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
} from "./baseController.js";
import { TOKEN_KEY } from "../config.js";
import jwt from "jsonwebtoken";
import user from "../models/userModel.js";

export const deleteUser = deleteOne(User);

export async function getAllCompanyUsers(req, res, next) {
  try {
    const data = req.body;
    const companyUsersList = await User.find({
      isSuperAdminCreated: true,
    }).populate("companyId");
    res.status(201).json({
      message: "Get Company Users List",
      companyUsersList,
    });
  } catch (err) {
    console.log("err", err);
  }
}
export async function createUser(req, res, next) {
  try {
    const data = req.body;
    const exist = await User.find({ email: data.email });
    if (exist.length === 0) {
      const user = await User.create(data);
      const userCount = await User.find({ companyId: data.companyId });
      await Company.findByIdAndUpdate(
        { _id: data.companyId },
        { userCount: userCount.length }
      );
      res.status(201).json({
        message: "User Created Successfully",
        user,
      });
    } else {
      res.status(208).json({
        message: "User Already Exist",
        exist,
      });
    }
  } catch (err) {
    console.log("err", err);
  }
}

export async function login(req, res, next) {
  try {
    const data = req.body;
    const userData = await User.findOne({
      email: data.email,
      password: data.password,
    });

    const date = Date.now();
    if (userData) {
      const tokenId = jwt.sign(
        { email: data.email, password: data.password },
        TOKEN_KEY,
        {
          expiresIn: "20m",
        }
      );
      const editDetail = {
        sessionId: tokenId,
        lastLogin: date,
      };
      const user = await User.findByIdAndUpdate(userData._id, editDetail, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        message: "Login Successfully",
        user,
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "Invalid Credential",
      });
    }
  } catch (err) {
    console.log("err", err);
  }
}
export async function getCompanyUsers(req, res, next) {
  try {
    const data = req.query;
    console.log("data.....", data)

    const usersList = await User.find({
      companyId: data.companyId,
      _id: { $nin: [data.userId] }, // Exclude the current user only
      role: { $nin: ["admin"] } // Exclude admin role
    })
    .where("role").ne("SuperAdmin"); // Additional condition to exclude SuperAdmin role
    
    res.status(201).json({
      message: "List Of users In Company",
      usersList,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUser(req, res, next) {
  try {
    const userId = req.query.userId;
    const usersList = await User.findOne({ _id: userId }).populate("companyId");

    res.status(201).json({
      message: "Get users",
      usersList,
    });
  } catch (err) {
    console.log("err", err);
  }
}

export async function getAllUser(req, res, next) {
  try {
    const data = req.query;
    const usersList = await User.find({
      companyId: data.companyId,
      role: { $ne: "admin" },
      _id: { $ne: data.userId },
    }).populate("companyId");

    res.status(201).json({
      message: "Get users",
      usersList,
    });
  } catch (err) {
    console.log("err", err);
  }
}

// export async function updateUser(req, res, next) {
//   try {
//     const data = req.body;

//     const userId = req.params.id;

//     const exist = await User.find({ email: data.email });
//     if (exist.length > 0) {
//       const existEmail = exist[0].email;
//       const newEmail = await User.find({ _id: userId });
//       if (existEmail == newEmail[0].email) {
//         const editDetail = {
//           email: data.email,
//           password: data.password,
//           name: data.name,
//           phone: data.phone,
//           role: data.role,
//           confirmPassword:data.confirmPassword,
//         };
//         const editData = await User.findByIdAndUpdate(userId, editDetail, {
//           new: true,
//           runValidators: true,
//         });
//         res.status(201).json({
//           message: "User Details Updated Successfully",
//           editData,
//         });
//       } else {
//         res.status(208).json({
//           message: "User Already Exist",
//           exist,
//         });
//       }
//     } else {
//       const editDetail = {
//         email: data.email,
//         password: data.password,
//         name: data.name,
//         phone: data.phone,
//         role: data.role,
//       };
//       const editData = await User.findByIdAndUpdate(userId, editDetail, {
//         new: true,
//         runValidators: true,
//       });
//       res.status(201).json({
//         message: "User Details Updated Successfully",
//         editData,
//       });
//     }
//   } catch (err) {
//     console.log("err", err);
//   }
// }
export async function updateUser(req, res, next) {
  try {
    const data = req.body;
    const userId = req.params.id;
    // check email exist or not 
    const existingUser = await User.findOne({ email: data.email, _id: { $ne: userId } });

    const exist = await User.find({ email: data.email });
    if (exist.length > 0) {
      const existEmail = exist[0].email;
      const newEmail = await User.find({ _id: userId });
      if (existEmail == newEmail[0].email) {
        const editDetail = {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
          role: data.role,
          confirmPassword: data.confirmPassword,
        };
        const editData = await User.findByIdAndUpdate(userId, editDetail, {
          new: true,
          runValidators: true,
        });
        res.status(201).json({
          message: "User Details Updated Successfully",
          editData,
        });
      } else {
        res.status(208).json({
          message: "User Already Exist",
          exist,
        });
      }
    } else {
      const editDetail = {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
      };
      const editData = await User.findByIdAndUpdate(userId, editDetail, {
        new: true,
        runValidators: true,
      });
      res.status(201).json({
        message: "User Details Updated Successfully",
        editData,
      });
    }

    const editDetail = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      name: data.name,
      phone: data.phone,
    };

    const editData = await User.findByIdAndUpdate(userId, editDetail, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "User Details Updated Successfully",
      editData,
    });
  } catch (err) {
    console.log("error....:", err);
    next(err);
  }
}
export async function updateUserThemeColor(req, res, next) {
  try {
    const data = req.body;
    const userId = data.userId;
    const editData = {
      userThemeColor: data.userThemeColor,
    };
    const updateData = await user.findByIdAndUpdate(userId, editData, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "User Theme Updated Successfully",
      updateData,
    });
  } catch (err) {
    next(err);
  }
}
export async function getUserData(req, res, next){
  try {
    const userId = req.query.userId;
    const usersList = await User.findOne({ _id: userId }).populate("companyId");

    res.status(201).json({
      message: "Get users",
      usersList,
    });
  } catch (err) {
    console.log("err", err);
  }
}
