import { Router } from "express";
import {
  deleteproductTreeStructure,
  getAllProductTreeStructure,
  getProductTreeStructure,
  getAllProductDetails,
  getProductList,
  getTreeProductList,
  getParticularProduct,
  getFtaTreeData,
  getMttrTreeData,
  getFmecaTreeData,
  getPmmraTreeData,
  getSafetyTreeData,
} from "../controllers/productTreeStructureController.js";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

router.route("/").get(verifyToken, getAllProductTreeStructure);

router.route("/delete").delete(verifyToken, deleteproductTreeStructure);

router.route("/detail").get(verifyToken, getProductTreeStructure);

router.route("/list").get(verifyToken, getAllProductDetails);

router.route("/product/list").get(verifyToken, getProductList);

router.route("/get/tree/product/list").get(getTreeProductList);

router.route("/get/particular/product").get(getParticularProduct);

router.route("/fta/details").get(getFtaTreeData);

router.route("/mttr/details").get(getMttrTreeData);
router.route("/fmeca/details").get(getFmecaTreeData);

router.route("/pmmra/details").get(getPmmraTreeData);
router.route("/safety/details").get(getSafetyTreeData);

export default router;
