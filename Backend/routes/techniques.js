import express from "express";
import {
  getTechniques,
  addTechnique,
  updateTechnique,
  deleteTechnique,
} from "../controllers/techniquesController.js";

import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js";
const router = express.Router();

// Protected Routes
router.get("/", verifyTokenOptional, getTechniques);  // guest can see empty or default quotes
router.get("/", verifyToken, getTechniques);
router.post("/", verifyToken, addTechnique);
router.put("/:id", verifyToken, updateTechnique);
router.delete("/:id", verifyToken, deleteTechnique);

export default router;

