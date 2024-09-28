import { Router } from "express";
const router = Router();

import {
  createFailureRatePrediction,
  getAllFailureRatePrediction,
  getFailureRatePrediction,
  updateFailureRatePrediction,
  deleteFailureRatePrediction,
  getProductFailureRateData,
  getNprd2016Datas,
  getNprd2016Value,
  getNprd2016Description,
} from "../controllers/failureRatePredictionController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").post(verifyToken, createFailureRatePrediction);
router.route("/update").patch(verifyToken, updateFailureRatePrediction);
router.route("/").get(verifyToken, getAllFailureRatePrediction);
router.route("/details").get(verifyToken, getProductFailureRateData);
router.route("/get/nprd/2016").get(getNprd2016Datas);
router.route("/get/nprd/2016/value").get(getNprd2016Value);
router.route("/get/nprd/2016/desc").get(getNprd2016Description);
router
  .route("/:id")
  .get(verifyToken, getFailureRatePrediction)
  .delete(verifyToken, deleteFailureRatePrediction);

export default router;
