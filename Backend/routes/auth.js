import express from "express";
import { signup, login, googleLogin, adminLogin, logout, getSession } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);
router.get("/session", getSession);

router.post("/admin-login", adminLogin);


export default router;
