import { Router } from "express";
const router = Router();

import {
  createProductBreakdownStructure,
  deleteproductBreakdownStructure,
  getAllproductBreakdownStructure,
  getProductBreakdownStructure,
  updateProductBreakdownStructure,
} from "../controllers/productBreakdownStructureController.js";
import { verifyToken } from "../utils/tokenAuth.js";

router.route("/").get(getAllproductBreakdownStructure).post(createProductBreakdownStructure);

router.route("/update/detail").patch(verifyToken, updateProductBreakdownStructure);

router
  .route("/:id")
  .get(verifyToken, getProductBreakdownStructure)
  .delete(verifyToken, deleteproductBreakdownStructure);

export default router;
