import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {

  // const token = req.cookies.token;

  const token =
  req.cookies.token ||
  req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin user
    if (decoded.role === "admin") {
      req.user = { id: decoded.id, username: "Admin", role: "admin" };
      return next();
    }

    // Normal user
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyTokenOptional = async (req, res, next) => {

  // const token = req.cookies.token;

  const token =
  req.cookies.token ||
  req.headers.authorization?.split(" ")[1];

  if (!token) return next(); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    next(); // invalid token treats as guest
  }
};