import express from 'express';

import { validateSignUpData } from '../utils/validation.js';
import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/emailServices.js';
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
        
        const savedUser = await user.save();
        const token = await savedUser.getJwt();

        //add the token to cookie andsend the response back to the user
         res.cookie("token", token);
      res.json({message: "user signed up successfully", data: savedUser});
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

        res.send(user)

    }catch (err){
        res.status(401).send("error in logging in the user");
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
AuthRouter.post("/forget-password",async (req,res)=>{

    try{
        const {emailId}=req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("email id is not valid");
        }
        const user =await UserModel.findOne({emailId});
        if(!user){
            throw new Error("user not found");
        }
        // generate a reset token
        const resetToken =crypto.randomBytes(20).toString('hex');
        // set the reset token and its expiry on the user model
        user.resetPasswordToken =resetToken;
        user.resetPasswordExpires =Date.now() +3600000; // 1 hour from now
        await user.save();

        const emailSent = await sendPasswordResetEmail(emailId, resetToken);
        if(!emailSent){
            user.resetPasswordToken =undefined;
            user.resetPasswordExpires =undefined;
            await user.save();
            return res.status(500).send("error in sending the email");
        }
        res.status(200).send("password reset email sent successfully");
    }catch(err){
        res.status(500).send("error in forget password: " + err.message);
    }
})
// 2. RESET PASSWORD API
AuthRouter.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user with this token AND check if token is not expired
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // $gt means "greater than"
        });

        if (!user) {
            return res.status(400).send("Invalid link or expired");
        }

        // Hash the new password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiry

        await user.save();

        res.send("Password reset successfully.");

    } catch (error) {
        res.status(500).send("An error occurred: " + error.message);
    }
});

export default AuthRouter;