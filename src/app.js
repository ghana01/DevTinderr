import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import {userAuth} from "./middleware/auth.js"
import  connectDB from "./config/database.js"
import UserModel from "./models/user.js"
import {validateSignUpData} from "./utils/validation.js"
const app=express();// it is instances of express


// handel auth for admin routes

app.use(express.json())// middleware to parse json body

app.use(cookieParser()) // middleware to parse cookies

app.post("/signup",async (req,res)=>{
    //Encypt the password
    // const ALLOWED_FIELDS = ["firstName", "lastName", "emailId", "password", "age", "gender", "skills"];
    // // Create a clean object with ONLY allowed keys
    // const cleanData = {};
    // Object.keys(req.body).forEach(key => {
    //     if (ALLOWED_FIELDS.includes(key)) {
    //         cleanData[key] = req.body[key];
    //     }
    // });

    // Now cleanData does NOT have "xyr" inside it at all.
  //  console.log(cleanData);
   // console.log(req.body);
   //  creating a new instacnes of the user model
    // const user = new UserModel({
    //     firstName:"mahendra",
    //     lastName:"bahubali",
    //     emailId:"mahendrabahbali@gmail.com",
    //     password:"bahubali@123",
    //     age:25,
    //     gender:"male"
    // })
  

    try{
         // validtion of data
         validateSignUpData(req);
         const {firstName,lastName,emailId,password} =req.body;
         //hashing the password before saving to database
        

        const hashedPassword =await bcrypt.hash(password,10);
        

         //creating the new intances of the user model with clean data
        const user =new UserModel({
            firstName,
            lastName,
            emailId,
            password:hashedPassword,

        });
        
        await user.save();
      res.send("user signed up successfully")
    } catch(err){
        res.status(500).send("error in signing up the user: " + err.message);
    }
})

app.post("/login",async (req,res)=>{


    try{
         const {emailId,password}=req.body;
         
        if(!validator.isEmail(emailId)){
            throw new Error("email id is not valid");
        }
        const user =await UserModel.findOne({emailId});
        console.log(user);
        if(!user){
            throw new Error("user not found");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            throw new Error("password is incorrect");
        }
        //create a jwt toekn
        const token = await user.getJwt();

        //add the token to cookie andsend the response back to the user
         res.cookie("token", token);

        res.send("user logged in successfully");

    }catch (err){
        res.status(500).send("error in logging in the user");
    }
})

app.get('/profile',userAuth,async (req,res)=>{


    try{
         const user =req.user;
        res.send(user);
    

    }catch (err){
        throw new Error("ERROR:" + err.message);
    }
   

    
    
})
app.get("/user",userAuth,async (req,res)=>{
    const UserEmail=req.body.emailId;

    try{
           const User =await UserModel.findOne({emailId:UserEmail});
           if(!User){
             res.status(404).send("user not found");
           }
             res.send(User);
    }catch(err){
        res.status(500).send("error in fetching the user")
    }
})
app.get("/connectionrequest" ,userAuth,async (req,res)=>{
    try{
            const user =req.user;

            console.log("connection request received"
                
            );
            res.send(user.firstName +" send the connection request");
    }catch(err){}
})

connectDB().then(()=>{
    console.log("DB successfully connected");
    app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})
}).catch((err)=>{
    console.log("DB connection failed",err);
})   // this is the way to connect data base 






