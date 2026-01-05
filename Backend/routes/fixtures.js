import express from "express"; // Imports Express
import { getFixtures, addFixture, updateFixture, deleteFixture } from "../controllers/fixturesController.js"; // Imports fixture controllers
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Routes for fixtures
router.get("/", verifyTokenOptional, getFixtures);  // Gets all fixtures, accessible to guests and logged-in users
router.post("/", verifyToken, addFixture);          // Adds a new fixture, logged-in users only
router.put("/:id", verifyToken, updateFixture);    // Updates an existing fixture by ID, logged-in users only
router.delete("/:id", verifyToken, deleteFixture); // Deletes a fixture by ID, logged-in users only
export default router;
