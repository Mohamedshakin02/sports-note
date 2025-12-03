import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // 5. Create JWT token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
