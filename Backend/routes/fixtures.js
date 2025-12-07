import express from "express";
import { getFixtures, addFixture, updateFixture, deleteFixture } from "../controllers/fixturesController.js";
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyTokenOptional, getFixtures);  // anyone can see
router.post("/", verifyToken, addFixture);          // logged-in users
router.put("/:id", verifyToken, updateFixture);    // logged-in users
router.delete("/:id", verifyToken, deleteFixture); // logged-in users

export default router;
