import {Router} from "express";
import {
    deleteRBD,
    getAllRBD,
    getRBD,
    editRBD,
    createRBD
}
from "../controllers/RBDController.js";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();
router.route("/create").post(verifyToken, createRBD);
router.route("/").get(verifyToken, getAllRBD);
router.route("/delete").delete(verifyToken, deleteRBD);
router.route("/edit").put(verifyToken,editRBD);
router.route("/list").get(verifyToken,getRBD);
