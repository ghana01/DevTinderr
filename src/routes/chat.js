
import express from "express";
import Chat from "../models/chat.js";
import { userAuth } from "../middleware/auth.js";

const ChatRouter =express.Router();

ChatRouter.get("/:targetUserId",userAuth,async (req,res)=>{
    const {targetUserId} =req.params;
    const  userId =req.user._id;

    try{
        let chat =await Chat.findOne({participants:{$all:[userId,targetUserId]}})
        .populate("participants",["firstName","lastName","photoUrl"]);
        if(!chat){
            
            // if we have empty chat then we will create it 
            chat =await Chat.create({
                participants:[userId,targetUserId],
                message:[]
            })

            await chat.save();
            return res.json({
                chat
            })


        }

        res.json({
            message:"Chat fetched successfully",
            chat
        })
    }catch(err){
        res.status(400).send("Error"+err.message);
    }

})

export default ChatRouter;