import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    next();
  }
};

export const verifyTokenOptional = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    next(); // invalid token → treat as guest
  }
};