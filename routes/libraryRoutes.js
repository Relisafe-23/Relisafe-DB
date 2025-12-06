import { Router } from "express";
const router = Router();

import {
  createLibrary,
  getLibraryModulesData,
  createSeprateLibrary,
  updateSeprateLibraryField,
  deleteSeprateLibraryField,
  getSeprateLibraryAllField,
  getSeprateLibraryField,
  createConnectLibrary,
  updateConnectLibraryField,
  getConnectLibraryAllField,
  getConnectLibraryField,
  deleteConnectLibraryField,
  getSeparateModuleDataFieldValue,
  getSeparateDestinationData,
  getAllLibraryDataValues,
  getAllConnectedLibraryData,
  getConnectedLibraryAllField,
} from "../controllers/libraryController.js";

router.route("/").post(createLibrary);
router.route("/get/module/fields").get(getLibraryModulesData);

//separate library

router.route("/create/separate/value").post(createSeprateLibrary);
router.route("/get/all/separate/value").get(getSeprateLibraryAllField);
router.route("/get/separate/module/data").get(getSeparateModuleDataFieldValue);
router.route("/get/separate/module/destination/data").get(getSeparateDestinationData)
router
  .route("/separate/value/:id")
  .get(getSeprateLibraryField)
  .put(updateSeprateLibraryField)
  .delete(deleteSeprateLibraryField);

// connected Library

router.route("/create/connect/value").post(createConnectLibrary);
router.route("/get/all/connect/value").get(getConnectLibraryAllField);
router.route("/get/all/connect/library/value").get(getConnectedLibraryAllField);
router.route("/update/connect/value").put(updateConnectLibraryField);
router.route("/get/connect/value").get(getConnectLibraryField);
router.route("/delete/connect/value").delete(deleteConnectLibraryField);

router.route("/get/all/data/value").get(getAllLibraryDataValues);
router.route("/get/all/source/value").get(getAllConnectedLibraryData)

export default router;
