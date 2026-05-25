import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/users.routes.js';


dotenv.config();
const app =express();
app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
//  app.use(express.static("uploads"))

+ app.use(express.static(process.cwd() + '/backend/uploads'));



const start = async ()=>{
    // const connectDb=await mongoose.connect('mongodb+srv://riteshsoni1138_db_user:riteshsoni@linkedinclone.zcbonkt.mongodb.net/?appName=LinkedInClone');
    
    app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://riteshsoni1138_db_user:riteshsoni@linkedinclone.zcbonkt.mongodb.net/?appName=LinkedInClone");
     console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
 app.listen(9090,()=>{
    console.log("app is lisining on port 9090 ");
 })
}
start();





