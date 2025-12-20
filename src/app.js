import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import AuthROuter from './routes/auth.js';
import ProfileRouter from './routes/profile.js';
import RequestRouter from './routes/request.js';
import UserRouter from './routes/user.js';  
import http from 'http';
import ChatRouter from './routes/chat.js';
import cors from 'cors';
import  connectDB from "./config/database.js"
import intialiseSocket from "./utils/socket.js"

dotenv.config();

const app=express();
app.use(cors({
    origin: "http://localhost:5173", // This must match your Frontend URL exactly
    credentials: true
}));
app.use(express.json())// middleware to parse json body
app.use(cookieParser()) // middleware to parse cookies



app.use("/auth",AuthROuter);
app.use("/profile",ProfileRouter);
app.use("/request",RequestRouter);
app.use("/user",UserRouter);
app.use('/chat',ChatRouter);

const server =http.createServer(app);
intialiseSocket(server);


connectDB().then(()=>{
    console.log("DB successfully connected");
    server.listen(4000,()=>{
    console.log("Server is running on port 4000");
})
}).catch((err)=>{
    console.log("DB connection failed",err);
})   // this is the way to connect data base 






