import express from "express"; // Imports Express
import { signup, login, googleLogin, adminLogin, logout, getSession } from "../controllers/authController.js"; // Imports auth controllers

const router = express.Router(); // Creates Express router

// Routes for user authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.get("/session", getSession);

// Route for admin authentication
router.post("/admin-login", adminLogin);


export default router;
