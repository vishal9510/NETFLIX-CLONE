import { User } from "../model/user.model.js";

import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import bycrptjs from "bcryptjs";

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            })
        }

        const emailRegex = /^[a-zA-Z0-9 ]+@[a-zA-Z ]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            })
        }

        if (!password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at 6 characters "
            })
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }
        const existingUserByUsername = await User.findOne({ username: username });

        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            })
        }

        const salt = await bycrptjs.genSalt(10);
        const hashedPassword = await bycrptjs.hash(password, salt);
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();


        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                success: true,
                user: {
                    ...newUser.email,
                    password: "",
                },
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to create user"
            })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bycrptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            user: {
                ...newUser.email,
                password: "",
            },
        })
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        })

    }
}


    export async function logout(req, res) {
        try {
            // TODO: Implement logout logic here
            res.clearCookie("token");
            res.send("Logged out successfully");

        } catch (error) {
            console.log("Error in logout controller", error.message);
            res.status(500).json({
                success: false,
                message: "Server error"
            })

        }
        
    };