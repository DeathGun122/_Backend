import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../lib/generatorToken.js";       
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
        });

        if(newUser){
            generateTokenandSetCookie(newUser, res);
            await newUser.save();

            return res.status(201).json({ 
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link,
                followers: newUser.followers,
                following: newUser.following,
            });
        }
        else{
            return res.status(400).json({ error: "User creation failed" });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    res.json({
        data: "Login page",
    });
}

export const logout = async (req, res) => {
    res.json({
        data: "Logout page",
    });
}