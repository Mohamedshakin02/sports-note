import express from "express";
import { getMoments, addMoment, updateMoment, deleteMoment } from "../controllers/momentsController.js";
import { verifyToken, verifyTokenOptional } from "../middleware/authMiddleware.js"; // middleware to get logged-in user

const router = express.Router();

router.get("/", verifyTokenOptional, getMoments);
router.post("/", verifyToken, addMoment); // protected, add moment for logged-in user
router.put("/:id", verifyToken, updateMoment);   //  Update
router.delete("/:id", verifyToken, deleteMoment);

export default router;