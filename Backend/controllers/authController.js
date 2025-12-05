import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: create JWT and set cookie
const createTokenAndSetCookie = (res, user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
};

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

        if (username.length < 5) {
            return res.status(400).json({ message: "Username must have at least 5 characters." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have at least 6 characters." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        createTokenAndSetCookie(res, newUser);

        res.status(201).json({
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        createTokenAndSetCookie(res, user);

        res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) user = await User.create({ username: name, email, password: null, googleUser: true });

        createTokenAndSetCookie(res, user);

        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(400).json({ message: "Google login failed" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    res.json({ message: "Logged out successfully" });
};

export const getSession = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ user: null });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.json({ user: null });

        res.json({ user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.json({ user: null });
    }
};
