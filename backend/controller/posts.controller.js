import { Comment } from "../models/commentmodel.js";
import Post from "../models/postmodel.js";
import Profile from "../models/profilemodel.js";
import User from "../models/usermodel.js";


export const  createPost=async (req,res)=>{

      const {token}= req.body;
    try{
      

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
     
         const  post = new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file!=undefined?req.file.filename:"",
            filetype:req.file!=undefined?req.file.mimeType:"",

         })
         await post.save();
            return res.status(200).json({message:"post created successfully"});

    }catch ( err){

         return  res.status(500).json( { message: err.message});
    }


}


export const getAllPosts=async (req,res)=>{
        
    try{
        const posts=await Post.find()
         .populate("userId", "name username email profilePicture");

        return res.status(200).json({posts});
    }catch (err){
        return res.status(500).json({message:err.message});
    }

}

export const deletePost=async (req,res)=>{
    const {token,postId}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id");

        if (!user){
            return res.status(400).json({message:"user not found"});
        }

        const post=await Post.findOne({_id:postId});

        if (!post){
            return res.status(400).json({message:"post not found"});
        }

        if (post.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"you are not authorized to delete this post"});
        }

        await Post.deleteOne({_id:postId});
        return res.status(200).json({message:"post deleted successfully"});

    }catch (err){
        return res.status(500).json({message:err.message});
    }

}


export const commentPost=async(req,res)=>{

       const {token, postId,commentBody}=req.body;

    try{
        const   user=await User.findOne({token:token}).select("_id");

        if (!user){
            return res.status(400).json({message:"user not found"});
        }

        const   post=await Post.findOne({_id:postId});

        if (!post){
            return res.status(400).json({message:"post not found"});
        }
        const comment= new Comment({
            userId:user._id,
            postId:post._id,
            body:commentBody
        })
        await comment.save();
        return res.json({message:"comment added"});




    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



export const get_connents_by_post = async (req, res) => {

    const { postId } = req.query;

    try {

        const comments = await Comment.find({ postId })
            .populate("userId", "name username profilePicture");

        return res.status(200).json({
            comments
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};


export const  delete_comment_user=async(req,res)=>{
   const {token,comment_id}=req.body;

    try{

        const user = await User.findOne({ token: token }).select("_id");
        
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }   
        const comment   = await Comment.findOne({ _id:comment_id});
        
        if (!comment){
            return res.status(400).json({message:"comment not found"});
        }

        if (comment.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"you are not authorized to delete this comment"});
        }
        await Comment.deleteOne({_id:comment_id});
        return res.json({message:"comment deleted"});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



export const increment_likes=async(req,res)=>{
       const {post_id}=req.body;
       try{

        const post= await Post.findOne({_id:post_id});
        
        if (!post){
            return res.status(400).json({message:"post not found"});
        }   
        post.likes=post .likes+1;
        await post.save();
        return res.json({message:"likes incremented"});
        


       } catch  (err){
        return res.status(500).json({message:err.message});
       }
}


export const getUserProfileAndUserBasedOnUsername=async(req,res)=>{
    const {username}=req.query;

    try{
        const user=await User.findOne({username:username}).select("-password -token");
        if (!user){
            return res.status(400).json({message:"user not found"});
        }
        const userProfile=await Profile.findOne({userId:user._id})
        .populate("userId","name username email profilePicture");
        if (!userProfile){
            return res.status(400).json({message:"user profile not found"});
        }
        return res.status(200).json({user,userProfile});    

    }catch(err){
        return res.status(500).json({message:err.message});
    }                                       


}




