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

export default router;
