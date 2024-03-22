import { Router } from "express";
const router = Router();

import {
  createProjectPermission,
  updateProjectPermission,
  getProjectPermission,
  getAllProjectPermission,
  deleteProjectPermission,
  getUserMenuList,
  getCompanyUserList,
} from "../controllers/projectPermissionController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").get(verifyToken, getAllProjectPermission);

router.route("/").post(verifyToken, createProjectPermission);

router.route("/list").get(verifyToken, getProjectPermission);

router.route("/:id").patch(verifyToken, updateProjectPermission).delete(verifyToken, deleteProjectPermission);

router.route("/menu/list").get(verifyToken, getUserMenuList);

router.route("/company/user/list/:id").get(verifyToken, getCompanyUserList);

export default router;
