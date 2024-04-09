import multer from "multer";
import { Router } from "express";
import FTAtreeData from "../models/FTAtreeModel.js";
import mongoose from "mongoose";

const router = Router();

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define your upload route
router.post("/upload", upload.single("jsonFile"), async (req, res) => {
  try {
    const jsonData = JSON.parse(req.file.buffer.toString());

    // Generate a new ID for the uploaded data
    const newId = new mongoose.Types.ObjectId();

    // Function to update the parentId recursively
    const updateParentId = (node) => {
      if (node) {
        node.parentId = newId;
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => updateParentId(child));
        }
      }
    };

    // Update the parentId in jsonData
    updateParentId(jsonData.treeStructure);

    // Update the _id field with the newId
    jsonData._id = newId;

    // Create a new document in your MongoDB collection
    const data = await FTAtreeData.create(jsonData);

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading JSON data" });
  }
});

export default router;
