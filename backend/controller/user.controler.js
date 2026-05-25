
import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import Profile from "../models/profilemodel.js";
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from "path";
import ConnectionRequest from "../models/connectionsmodel.js";



// const convertUserDataTOPDF= async(userData)=>{
//     const doc = new PDFDocument();
//     const outputPath=crypto.randomBytes(32).toString("hex")+".pdf";
//     const stream=fs.createWriteStream("uploads/"+outputPath);



//     doc.pipe(stream);
//     doc.image(`/uploads/${userData.userId.profilePicture}`,{align:"center",width:100});

//     doc.fontSize(14).text(`Name:${userData.userId.name}`);
//     doc.fontSize(14).text(`Username:${userData.userId.username}`);
//     doc.fontSize(14).text(`Email:${userData.userId.email}`);
//     doc.fontSize(14).text(`Bio:${userData.userId.bio}`);
//     doc.fontSize(14).text(`Current position:${userData.userId.currentPosition}`);

//      doc.fontSize(14).text("past Work")
//      userData.PastWork.forEach((work,index)=>{
//         doc.fontSize(14).text(`company Name: ${work.companyName}`);
//         doc.fontSize(14).text(`position: ${work.position}`);
//         doc.fontSize(14).text(`years:${work.years}`);

//      })
//      doc.end();
//     return outputPath;

// }



const convertUserDataTOPDF = async (userData) => {

    const doc = new PDFDocument();
    console.log(userData);

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

    const pdfPath = path.join("uploads", outputPath);

    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);


    if (userData?.userId?.profilePicture) {

        const imagePath = path.join(
            "uploads",
            userData.userId.profilePicture
        );

        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, {
                align: "center",
                width: 100,
            });
        }
    }


    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

    doc.moveDown();
    doc.fontSize(16).text("Past Work");

    userData.postWork.forEach((work) => {

        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);

        doc.moveDown();
    });
    doc.end();

    return outputPath;
};


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


    } catch (err) {
        return res.status(500).json({ message: err.message })
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



    } catch (err) {

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

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }


}


export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            if (existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({ message: "User already exists" })
            }
        }

        object.assign(user, newUserData);
        await user.save();
        return res.json({ message: "User Updated" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(userProfile);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }



}


export const updateProfileData = async (req, res) => {

    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });
        if (!userProfile) {
            return res.status(400).json({ message: "user not found" });
        }


        const profile_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();

        return res.json({ message: " User Profile Updated" });


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

export const getAllUserProfile = async (req, res) => {

    try {
        const profile = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({ profile });
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const downloadProfile = async (req, res) => {
    try {

        const user_id = req.query.id;

        const userProfile = await Profile.findOne({ userId: user_id }).populate('userId', 'name username email  profilePicture');
        let outputPath = await convertUserDataTOPDF(userProfile);

        console.log(outputPath);
        return res.json({ "message": outputPath })
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const sendConnectionRequest = async (req, res) => {
    const { token, connectionId } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({ message: "connection user not found" })
        }

        const existingRequst = await ConnectionRequest.findOne(
            {
                userId: user.id,
                connectionId: connectionUser._id
            }
        )

        if (existingRequst) {
            return res.status(400).json({ message: "request already sent" })
        }
        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        })
        await request.save();
        return res.json({ message: "Request Sent" })


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}
// this is for whom i send request
export const getMyConnectionReqests = async (req, res) => {

    const { token } = req.body;
    try {

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const connection = await ConnectionRequest.findOne({ userId: user._id }).populate('connectionId', 'name username eamil profilepicture');
        res.json({ connection })

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const whatAreMyConnections= async( req,res)=>{

    const {token}=req.body;
    try{
         const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
       const connections = await ConnectionRequest.findOne({ connectionId: user._id }).populate('connectionId', 'name username eamil profilepicture');
        res.json({ connections })

    }catch(err){
        return  res.status(500).json( { message: err.message});
    }

}


export const acceptConnectionRequest = async(req,res)=>{
    const {token,requestId,action_type}=req.body;
    try{
         const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        const connection= await ConnectionRequest.findOne({ _id: requestId})
        if(!connection){
            return res.status(404).json({message:"Connection not  found"})
        }

        if (action_type=="accept"){
            connection.status_accepted=true;
        }else{
             connection.status_accepted=false;
        }
        await connection.save();
        return res.json({message:"request updated"})

    }catch(err){
  return  res.status(500).json( { message: err.message});
    }
}



