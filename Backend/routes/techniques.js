import express from "express";
import {
  getTechniques,
  addTechnique,
  updateTechnique,
  deleteTechnique,
} from "../controllers/techniquesController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Routes
router.get("/", verifyToken, getTechniques);
router.post("/", verifyToken, addTechnique);
router.put("/:id", verifyToken, updateTechnique);
router.delete("/:id", verifyToken, deleteTechnique);

export default router;
