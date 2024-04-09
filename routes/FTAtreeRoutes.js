import { Router } from "express";
import {
  createFTAtreeStructure,
  getFRrate,
  getFTAtreeDatas,
  updateParentFTAtreeStructure,
} from "../controllers/FTAtreeController.js";
import {
  createChildNode,
  deleteFTAtreeStructure,
  getChildNode,
  getLastGateId,
  updateFTAtreeStructure,
  FTAtree,
} from "../controllers/FTAchildNodeTreeController.js";

const router = Router();

router.route("/create/parent").post(createFTAtreeStructure);
router.route("/get/:id").get(getFTAtreeDatas);
router.route("/create/child/node").post(createChildNode);
router.route("/update/:projectId/:childId").put(updateFTAtreeStructure);
router.route("/delete/:projectId/:childId").delete(deleteFTAtreeStructure);
router.route("/gatecount/:projectId/:companyId").get(getLastGateId);
router.route("/update/property/:id").patch(updateParentFTAtreeStructure);
router.route("/get/child/:projectId/:parentId").get(getChildNode);
router.route("/get/tree/:id").get(FTAtree);
router.route("/get/frRate/:projectId/:productId/:treeStructureId/:companyId").get(getFRrate);

export default router;
