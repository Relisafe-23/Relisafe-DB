import { Router } from "express";
const router = Router();

import {
  projectCreation,
  updateProject,
  getProject,
  getAllProjectList,
  deleteProject,
  updateProjectDetails,
  getCompanyUserProjectList,
} from "../controllers/projectController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").get(verifyToken, getAllProjectList);

router.route("/").post(verifyToken, projectCreation);

router.route("/update/details/:id").patch(verifyToken, updateProjectDetails);

router.route("/company/user").get(verifyToken, getCompanyUserProjectList);

router.route("/:id").get(getProject).patch(verifyToken, updateProject).delete(verifyToken, deleteProject);

export default router;
