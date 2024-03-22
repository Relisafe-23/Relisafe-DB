import { Router } from "express";
const router = Router();

import {
  createSparePartsAnalysis,
  updateSparePartsAnalysis,
  getAllSparePartsAnalysis,
  getSparePartsAnalysis,
  deleteSparePartsAnalysis,
} from "../controllers/sparePartsAnalysisController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/details").get(verifyToken, getAllSparePartsAnalysis);
router.route("/").post(verifyToken, createSparePartsAnalysis);
router.route("/update").patch(verifyToken, updateSparePartsAnalysis);

router.route("/:id").get(verifyToken, getSparePartsAnalysis).delete(verifyToken, deleteSparePartsAnalysis);

export default router;
