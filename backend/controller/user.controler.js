
import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import Profile from "../models/profilemodel.js";
import crypto from 'crypto';
import { TokenOutlined } from "@mui/icons-material";

export const register = async (req, res) => {

    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) return res.status(400).json({ message: "all fields are required" });

        const user = await User.findOne({
            email
        });
        if (user) return res.status(400).json({ message: "user alrady exist" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();

        const profile = new Profile({ userId: newUser._id })

        return res.json({ message: "User Created " });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "all fields are required" });

        const user = await User.findOne({
            email
        });
        if (!user) return res.status(404).json({ message: "user not exist" });
        const ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) return res.status(400).json({ message: "Invalid password" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { token });

        return res.json({ message: "Login Succesful", token });



    } catch (error) {

    }



}

export const uploadprofilepicture = async (req, res) => {
    const { token } = req.body;
    try {

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.Status(400).json({ message: "user not found" });
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "Profile Picture Updated" });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }


}