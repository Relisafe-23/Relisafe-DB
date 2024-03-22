import { Router } from "express";
const router = Router();

import {
  createFailureRatePrediction,
  getAllFailureRatePrediction,
  getFailureRatePrediction,
  updateFailureRatePrediction,
  deleteFailureRatePrediction,
  getProductFailureRateData,
} from "../controllers/failureRatePredictionController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.route("/").post(verifyToken, createFailureRatePrediction);
router.route("/update").patch(verifyToken, updateFailureRatePrediction);
router.route("/").get(verifyToken, getAllFailureRatePrediction);
router.route("/details").get(verifyToken, getProductFailureRateData);
router.route("/:id").get(verifyToken, getFailureRatePrediction).delete(verifyToken, deleteFailureRatePrediction);

export default router;
