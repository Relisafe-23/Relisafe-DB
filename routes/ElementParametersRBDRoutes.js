import {Router} from "express";

import {createElementParameter,getElementParameterById } from "../controllers/ElementParameterController.js"
import { verifyToken } from "../utils/tokenAuth.js";

const router= Router();
router.route("/create").post(verifyToken,createElementParameter)
router.route("/get/all").get(verifyToken, getElementParameterById )
export default router