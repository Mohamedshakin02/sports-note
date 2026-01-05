import express from "express"; // Imports Express
import {
  getSessions,
  addSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionsController.js"; // Imports session controllers

import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Routes for sessions
router.get("/", verifyTokenOptional, getSessions);  // Gets all sessions, guest sees empty or default
router.get("/", verifyToken, getSessions);          // Gets all sessions, logged-in only
router.post("/", verifyToken, addSession);          // Adds a new session, logged-in only
router.put("/:id", verifyToken, updateSession);     // Updates a session by ID, logged-in only
router.delete("/:id", verifyToken, deleteSession);  // Deletes a session by ID, logged-in only

export default router;
