import { Router } from "express";
import {
getPbsReport,
getReliabilityReport,
getMaintainabilityReport,
getPreventiveReport,
getSparePartsAnanysisReport,
getFmecaReport,
getSafetyReport,
} from "../controllers/reportController.js";


const router = Router();


router.route("/get/pbs/report").get(getPbsReport);

router.route("/get/reliablility/report").get(getReliabilityReport);

router.route("/get/maintainability/report").get(getMaintainabilityReport);

router.route("/get/preventive/report").get(getPreventiveReport);

router.route("/get/spart/report").get(getSparePartsAnanysisReport);

router.route("/get/fmeca/report").get(getFmecaReport);

router.route("/get/safety/report").get(getSafetyReport);

export default router;
