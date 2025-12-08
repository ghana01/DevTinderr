import express from 'express';
import {userAuth} from "../middleware/auth.js"
import {validateEditProfileData} from "../utils/validation.js"
const ProfileRouter =express.Router();

ProfileRouter.get('/',userAuth,async (req,res)=>{


    try{
         const user =req.user;
        res.send(user);
    

    }catch (err){
        throw new Error("ERROR:" + err.message);
    }
})
ProfileRouter.get('/view',userAuth,async (req,res)=>{
    const user =req.user;
    res.send("viewing" + user);
})
ProfileRouter.patch('/edit',userAuth,async (req,res)=>{


    try{
        if(!validateEditProfileData(req)){
             return res.status(400).send("validateEditProfileData");
        }
        const loggedInUser =req.user;
     //   loggedInUser.firstName =req.body.firstName;

        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key] =req.body[key];
        });

        await loggedInUser.save();
     ///   res.send("profile updated successfully");
     res.json({
        message :`${loggedInUser.firstName} profile updated successfully`,
        Data:loggedInUser
     })

        
        
        

    }catch(err){
        throw new Error('Error:' +err.message);
    }
})
// this api for chsnging the password in case we forget the password
ProfileRouter.patch('/change-password',userAuth,async (req,res)=>{
    try{
        const loggedInUser =req.user;
        const {oldPassword,newPassword} =req.body;
        const isPasswordValid =await loggedInUser.validatePassword(oldPassword);
        if(!isPasswordValid){
            return res.status(400).send("old password is incorrect");
        }
        loggedInUser.password =newPassword;
        await loggedInUser.save();
        res.send("password changed successfully");
    }
    catch(err){
        throw new Error("ERROR:" + err.message);
    }
})

export default ProfileRouter;