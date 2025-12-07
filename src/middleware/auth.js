
import jwt from "jsonwebtoken"

import UserModel from "../models/user.js"

export const userAuth =async(req,res,next)=>{
   
    // Read thr token form req cookies 
    try{
        const {token} =req.cookies;
        if(!token){
            throw new Error("token not found");
        }
     //validate the token
     const decodedObj = await jwt.verify(token,"mysecretkey");

     const {_id} =decodedObj;
        //find the user from the database
     const user = await  UserModel.findById(_id);
     if(!user){
        return res.status(404).send("user not found");
     }
     req.user =user;
     next();


    }catch(err){
        return res.status(400).send("ERROR:" +err.message);
    }
     
}