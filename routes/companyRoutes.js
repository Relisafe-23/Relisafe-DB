import { Router } from "express";
const router = Router();

import { getAllCompany, getCompany, updateCompany, deleteCompany, createCompany, createCompanyName} from "../controllers/companyController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.route("/").get(verifyToken, getAllCompany);

router.route("/").post(verifyToken, createCompany);

router.route("/:id").get(verifyToken, getCompany).patch(verifyToken, updateCompany).delete(verifyToken, deleteCompany);

router.route("/name").post(verifyToken, createCompanyName);

export default router;
