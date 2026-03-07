import { Router } from "express";
const router = Router();

import {
  createMttrPrediction,
  updateMttrPrediction,
  getMttrPrediction,
  getAllMttrPrediction,
  deleteMttrPrediction,
  createProcedure472,
  getProcedure472,
  updateProcedure472,
  deleteProcedure472,
  getAllMttr474,
} from "../controllers/mttrPredictionController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/details").get(verifyToken, getAllMttrPrediction);

router.route("/details/mil472").get(verifyToken, getAllMttr474);

router.route("/").post(verifyToken, createMttrPrediction);

router.route("/create/procedure").post(verifyToken, createProcedure472);

router.route("/get/procedure").get(verifyToken, getProcedure472);

router.route("/update/procedure/:id").patch(verifyToken, updateProcedure472);

router.route("/delete/procedure/:id").delete(verifyToken, deleteProcedure472);

router
  .route("/:id")
  .get(verifyToken, getMttrPrediction)
  .patch(verifyToken, updateMttrPrediction)
  .delete(verifyToken, deleteMttrPrediction);

export default router;
