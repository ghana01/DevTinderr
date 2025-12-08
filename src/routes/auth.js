import express from 'express';

import { validateSignUpData } from '../utils/validation.js';
import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
const AuthRouter =express.Router();
 

AuthRouter.post("/signup",async (req,res)=>{
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
AuthRouter.post("/login",async (req,res)=>{


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

AuthRouter.post("/logout",async (req,res) =>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now()),
        });
        res.send("user logged out successfully");

        //res.clearCookie("token");  it is also used to clear the cookie
    }catch(err){
        res.status(500).send("error in logging out the user");
    }
})





export default AuthRouter;