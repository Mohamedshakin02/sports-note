import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false,   // <-- FIXED
        default: null      // <-- FIXED
    },
    googleUser: {
        type: Boolean,
        default: false     // <-- Useful flag
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);