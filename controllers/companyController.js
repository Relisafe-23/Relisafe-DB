import Company from "../models/companyModel.js";
import { getAll, getOne, deleteOne, updateOne } from "./baseController.js";
import User from "../models/userModel.js";

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
    const existEmail = await Company.find({
      id: data.companyId,
    });

    const isEmailExists = existEmail.length === 0;

    if (!isEmailExists) {
      res.status(208).json({
        message: "Company Or Email Already Exist",
        existEmail,
      });
    }

    if (isEmailExists) {
      const company = await Company.findByIdAndUpdate(data.companyId, {
        companyName: data.companyName,
      });

      const existEmailUser = await User.find({
        email: data.email,
      });

      const isEmailUserExists = existEmailUser.length === 0;

      if (!isEmailUserExists) {
        res.status(208).json({
          message: "User Email Already Exist",
          existEmailUser,
        });
      }
      if (isEmailUserExists) {
        const companyUser = await User.create({
          companyName: data.companyName,
          name: data.name,
          password: data.password,
          email: data.email,
          confirmPassword: data.confirmPassword,
          phoneNumber: data.phoneNumber,
          companyId: data.companyId,
          role: data.role,
          isSuperAdminCreated: true,
        });

        res.status(201).json({
          message: "Company Details Created Successfully",
          company,
          companyUser,
        });
      }
    }
  } catch (err) {
    console.log("err", err);
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
