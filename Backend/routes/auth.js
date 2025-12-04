import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// signup
router.post("/signup", signup);

// Login
router.post("/login", login);

export default router;