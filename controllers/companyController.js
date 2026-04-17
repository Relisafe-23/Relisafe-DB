import Company from "../models/companyModel.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

export const getCompany = getOne(Company);
// export const getAllCompany = getAll(Company);
export const updateCompany = updateOne(Company);
export const deleteCompany = deleteOne(Company);

export async function getAllCompany(req, res, next) {
  try {
    const company = await Company.find();
    res.status(201).json({
      message: "Get All Comapnys",
      company,
    });
  } catch (err) {
    console.log("err", err);
  }
}



export async function createCompany(req, res, next) {
  try {
    const data = req.body;
    
    // Check if company exists
    const existEmail = await Company.find({
      id: data.companyId,
    });

    const isEmailExists = existEmail.length === 0;

    if (!isEmailExists) {
      return res.status(208).json({
        message: "Company Or Email Already Exist",
        existEmail,
      });
    }

    if (isEmailExists) {
      // Update company
      const company = await Company.findByIdAndUpdate(data.companyId, {
        companyName: data.companyName,
      });

      // Check if user email exists
      const existEmailUser = await User.findOne({
        email: data.email,
      });

      if (existEmailUser) {
        return res.status(208).json({
          message: "User Email Already Exist",
          existEmailUser,
        });
      }

      // Validate password and confirm password
      if (data.password !== data.confirmPassword) {
        return res.status(400).json({
          message: "Password and Confirm Password do not match",
        });
      }

      // Hash the password before creating user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Create company user
      const companyUser = await User.create({
        companyName: data.companyName,
        name: data.name,
        password: hashedPassword, // Store hashed password
        email: data.email,
        phoneNumber: data.phoneNumber,
        companyId: data.companyId,
        role: data.role,
        isSuperAdminCreated: true,
        // Don't store confirmPassword in database
      });

      // Remove password from response
      const userResponse = {
        _id: companyUser._id,
        name: companyUser.name,
        email: companyUser.email,
        companyName: companyUser.companyName,
        phoneNumber: companyUser.phoneNumber,
        role: companyUser.role,
        companyId: companyUser.companyId,
        isSuperAdminCreated: companyUser.isSuperAdminCreated
      };

      res.status(201).json({
        message: "Company Details Created Successfully",
        company,
        companyUser: userResponse, // Send user without password
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
}

export async function createCompanyName(req, res, next) {
  try {
    const data = req.body;
    const exist = await Company.find({ companyName: data.companyName });

    if (exist.length === 0) {
      const createCompany = await Company.create({
        companyName: data.companyName,
      });
      res.status(201).json({
        message: "Company Created SuccessFully",
        createCompany,
      });
    } else {
      res.status(208).json({
        message: "Company Name Already Exist",
        exist,
      });
    }
  } catch (err) {
    console.log("err");
  }
}
