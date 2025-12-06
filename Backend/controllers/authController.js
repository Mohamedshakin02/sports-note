import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import Moment from "../models/moment.js";

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

// Add default moments for the new user 
const defaultMoments = [
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029203/rcb.jpg", sport: "Cricket", title: "RCB Won This Year IPL", description: "I was extremely happy when RCB finally won this year IPL. It was their first win and I still can’t believe it happened. The joy and excitement of watching the team lift the trophy was unforgettable and truly special for all the fans.", date: "2025-06-03" },
    { imageUrl: "", sport: "Football", title: "Argentina Won FIFA World Cup 2022", description: "I was overjoyed when Argentina won the 2022 FIFA World Cup. The match was thrilling and seeing the team lift the trophy felt surreal. I still can’t believe the incredible journey and the unforgettable moments of that tournament.", date: "2022-12-18" },
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029367/india%20vs%20new%20zealand.jpg", sport: "Cricket", title: "India vs New Zealand Heart Breaking Semi Final 2019", description: "Watching India play against New Zealand in the 2019 semi final was heartbreaking. I felt so proud of the team for giving their best, yet so sad when the match ended. It was a rollercoaster of emotions that I will never forget.", date: "2019-07-10" },
    { imageUrl: "https://res.cloudinary.com/dy3pvt29a/image/upload/v1765029450/lakers%20win.jpg", sport: "Basketball", title: "Lakers Win NBA Finals 2020", description: "I was thrilled when the Lakers clinched the 2020 NBA Finals. Witnessing the team's hard work pay off and seeing the championship celebration was unforgettable. The energy and excitement of the game made it a truly special moment.", date: "2020-10-11" },
    { imageUrl: "", sport: "Cricket", title: "England Won 2019 Cricket World Cup", description: "I could not stop cheering when England won the 2019 Cricket World Cup. The final was so intense and nerve-wracking, and I still remember the excitement when the match ended in a super over. It was an amazing experience to witness history.", date: "2019-07-14" },


];

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

        const userMoments = defaultMoments.map(m => ({ ...m, userId: newUser._id }));
        await Moment.insertMany(userMoments);



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

// Google login
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            // New Google user → create user
            user = await User.create({ username: name, email, password: null, googleUser: true });

            // Add default moments for new Google user
            const userMoments = defaultMoments.map(m => ({ ...m, userId: user._id }));
            await Moment.insertMany(userMoments);
        }

        createTokenAndSetCookie(res, user);
        res.status(200).json({ user: { id: user._id, username: user.username, email: user.email } });

    } catch (err) {
        console.error("Google login error:", err);
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
