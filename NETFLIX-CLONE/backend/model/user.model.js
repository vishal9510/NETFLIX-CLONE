import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Image: { type: String, default: "" },
    searchHistory: { type: String,  default: [] },
});

export const User = mongoose.model("User", userSchema);