import express from "express";
import {
  getSessions,
  addSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionsController.js";

import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyTokenOptional, getSessions);  // guest can see empty or default quotes
router.get("/", verifyToken, getSessions);
router.post("/", verifyToken, addSession);
router.put("/:id", verifyToken, updateSession);
router.delete("/:id", verifyToken, deleteSession);

export default router;
