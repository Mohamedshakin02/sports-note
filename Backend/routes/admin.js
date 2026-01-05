import express from "express"; // Imports Express
import { getAllUsers, deleteUser, updateUser, createUser } from "../controllers/adminController.js"; // Imports admin controllers
import { verifyToken } from "../middleware/authMiddleware.js"; // Imports auth middleware

const router = express.Router(); // Creates Express router

// Admin-only middleware
const adminOnly = (req, res, next) => {
  // The token is decoded in verifyToken middleware
  if (!req.user || req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(verifyToken, adminOnly);

// Routes for user management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.post("/users", createUser);

export default router;
