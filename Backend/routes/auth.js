import express from "express";
import { signup, login, googleLogin, logout, getSession } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.get("/session", getSession);

export default router;
