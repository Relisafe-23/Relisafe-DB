import { Router } from "express";
import { verifyToken } from "../utils/tokenAuth.js";

const router = Router();

import { createPmMra, getPmMraDetails, getPmMra, updatePmMra, deletePmMra } from "../controllers/pmMraController.js";

router.route("/details").get(verifyToken, getPmMraDetails);

router.route("/").post(createPmMra);

router.route("/update").patch(verifyToken, updatePmMra);

router.route("/:id").get(verifyToken, getPmMra).delete(verifyToken, deletePmMra);

export default router;
