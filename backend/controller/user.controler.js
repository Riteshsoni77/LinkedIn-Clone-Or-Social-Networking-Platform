
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
           await profile.save();
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
            return res.status(400).json({ message: "user not found" });
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "Profile Picture Updated" });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }


}


export const  updateUserProfile= async(req,res)=>{
    try{
        const{token, ...newUserData}=req.body;

        const user= await User.findOne({token:token});
         if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const {username ,email}=newUserData;

        const existingUser=await User.findOne({$or:[{username},{email}]});

        if ( existingUser){
            if(existingUser||String(existingUser._id)!==String(user._id)){
                return res.status(400).json({message:"User already exists"})
            }
        }

        object.assign(user,newUserData);
        await user.save();
        return res.json({message:"User Updated"});

    }catch(error){
        return res.Status(500).json({message:error.message});
    }

}

export const getUserAndProfile= async(req,res)=>{
   try{
    const {token}= req.body;
   
     const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const userProfile= await Profile.findOne({userId:user._id})
        .populate('userId','name email username profilePicture');

      return res.json(userProfile); 
   
     } catch (error) {
        return res.status(500).json({ message: error.message })
    }



}


export const  updateProfileData = async ( req, res)=>{

    try{
        const { token, ...newProfileData}=req.body;

     const userProfile= await User.findOne({token:token});
         if (!userProfile) {
            return res.status(400).json({ message: "user not found" });
        }
     
      
      const  profile_to_update=await Profile.findOne({userId:userProfile._id});
        
    Object.assign(profile_to_update,newProfileData);
     await profile_to_update.save();

      return res.json({message:" User Profile Updated"});
       

    }catch(error ){
        return res.status(500).json({message:error.message});
    }

}

