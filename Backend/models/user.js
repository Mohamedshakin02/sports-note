import mongoose from "mongoose";

// Defines schema for storing user information with username, email, password, and Google user flag
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
        required: false,   
        default: null      
    },
    googleUser: {
        type: Boolean,
        default: false     
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);