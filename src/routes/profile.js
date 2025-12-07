import express from 'express';
import {userAuth} from "./middleware/auth.js"
const ProfileRouter =express.Router();

ProfileRouter.get('/profile',userAuth,async (req,res)=>{


    try{
         const user =req.user;
        res.send(user);
    

    }catch (err){
        throw new Error("ERROR:" + err.message);
    }
})

export default ProfileRouter;