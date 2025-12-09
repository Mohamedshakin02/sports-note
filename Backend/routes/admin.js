import express from "express";
import { getAllUsers, deleteUser, updateUser, createUser } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  // The token is decoded in verifyToken middleware
  if (!req.user || req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

router.use(verifyToken, adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.post("/users", createUser);

export default router;
