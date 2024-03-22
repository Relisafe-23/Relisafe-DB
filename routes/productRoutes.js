import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  parentProductCopyPaste,
  subProductCopyPaste,
  getSinglePbsTreeProduct
} from "../controllers/productController.js";
const router = Router();
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").get(verifyToken, getAllProduct).post(createProduct);
router.route("/update").patch(verifyToken, updateProduct);
router.route("/delete").patch(verifyToken, deleteProduct);

router.route("/:id").get(verifyToken, getProduct);

router.route("/copy/paste/parent/product").post(parentProductCopyPaste);
router.route("/copy/paste/sub/product").post(subProductCopyPaste);
router.route("/get/single/product").get(getSinglePbsTreeProduct)

export default router;
