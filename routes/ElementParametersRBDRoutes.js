import {Router} from "express";

import {createElementParameter,getElementParameterById, createParallelSection, updateelementParameters, deleteelementParameters, updateNestedBlock, deleteNestedBlock,createKOfN, getAvailableRBDs, getSubRBDDetails } from "../controllers/ElementParameterController.js"
import { verifyToken } from "../utils/tokenAuth.js";

const router= Router();
router.route("/create").post(verifyToken,createElementParameter)
router.route("/updateRBD/:id").patch(verifyToken,updateelementParameters)
router.route("/updateRBD/:parentId/block/:blockId").patch(verifyToken, updateNestedBlock);
router.route("/deleteRBD/:parentId/block/:blockId").delete(verifyToken, deleteNestedBlock);
router.route("/deleteRBD/:id").delete(verifyToken,deleteelementParameters)
router.route("/getRBD/:rbdId/:projectId").get(verifyToken, getElementParameterById )
router.route("/create/parallelsection/:rbdId/:projectId").post(verifyToken, createParallelSection )
router.route("/create/KOfN/:rbdId/:projectId").post(verifyToken,createKOfN)
router.route("/EditConfigRBD").get(verifyToken, getAvailableRBDs)
// router.route("/subrbd/:subRbdId").get(verifyToken, getSubRBDDetails)


export default router