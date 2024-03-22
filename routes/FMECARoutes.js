import { Router } from "express";
import { createFMECA, getFMECA, getAllFMECA, updateFMECA, deleteFMECA } from "../controllers/FMECAController.js";
import { verifyToken } from "../utils/tokenAuth.js";


const router = Router();

router.route("/").get(verifyToken, getAllFMECA).post(verifyToken, createFMECA);

router.route("/:id").delete(verifyToken, deleteFMECA);

router.route("/product/list").get(verifyToken, getFMECA);

router.route("/update").patch(verifyToken, updateFMECA);

export default router;
