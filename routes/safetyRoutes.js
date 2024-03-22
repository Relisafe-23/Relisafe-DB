import { Router } from "express";
import { createSafety, updateSafety, getSafety, getAllSafety, deleteSafety } from "../controllers/safetyController.js";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

router.route("/").get(verifyToken, getAllSafety).post(verifyToken, createSafety);

router.route("/:id").delete(verifyToken, deleteSafety);

router.route("/product/list").get(verifyToken, getSafety);

router.route("/update").patch(verifyToken, updateSafety);

export default router;
