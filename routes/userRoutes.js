import { Router } from "express";
const router = Router();

import {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  getCompanyUsers,
  getAllCompanyUsers,
  updateUserThemeColor,
  getUserData,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").post(verifyToken, createUser);
router.route("/").get(getUserData);
router.route("/list").get(getAllUser);
router.route("/company/list").get(verifyToken, getCompanyUsers);
router.route("/login").post(login);
router.route("/:id").get(getUser).patch(verifyToken, updateUser).delete(verifyToken, deleteUser);
router.route("/company/all").get(verifyToken, getAllCompanyUsers);
router.route("/theme/color").patch(verifyToken, updateUserThemeColor)

export default router;
