import { Router } from "express";
const router = Router();
import {
    createRBDConfig,
    //  getAllRBDConfig,
    getRBDConfig,

    // updateRBDConfig,
    deleteRBDConfig,
    updatedConfig
}
    from "../controllers/EditConfigRBDController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/create").post(verifyToken, createRBDConfig);
router.route("/").get(verifyToken, getRBDConfig);
router.route("/delete/:id").delete(verifyToken, deleteRBDConfig);
router.route("/edit").patch(verifyToken, updatedConfig);
// router.route("/list").get(verifyToken,getRBDConfig);

export default router;
