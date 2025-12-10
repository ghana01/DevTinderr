import express from 'express';

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import AuthROuter from './routes/auth.js';
import ProfileRouter from './routes/profile.js';
import RequestRouter from './routes/request.js';
import UserRouter from './routes/user.js';  
import  connectDB from "./config/database.js"


const app=express();
 
app.use(express.json())// middleware to parse json body

app.use(cookieParser()) // middleware to parse cookies

app.use("/auth",AuthROuter);
app.use("/profile",ProfileRouter);
app.use("/request",RequestRouter);
app.use("/user",UserRouter);






connectDB().then(()=>{
    console.log("DB successfully connected");
    app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})
}).catch((err)=>{
    console.log("DB connection failed",err);
})   // this is the way to connect data base 






