import express from 'express';
import {userAuth} from "../middleware/auth.js"
import ConnectionRequestModel  from '../models/connectionRequest.js';
import UserModel from '../models/user.js';
const RequestRouter =express.Router();


RequestRouter.post("/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
            const fromUserId=req.user._id;
            const toUserId=req.params.toUserId;
            const status =req.params.status; //staus here must be only interested and accepted
            //check the request should be only accepted or interested
            const AllowedStatus =["accepted","interested"];
            if(!AllowedStatus.includes(status)){
                return res.status(400).json({
                    message:"invalid status type:"+status
                })
            }
            // chek is  fromUserId exist in the database
            // chek is  toUserId exist in the database
            // if not then return error
            const toUserExist =await UserModel.findById(toUserId);
            if(!toUserExist){
                return res.status(404).send("to user not found");
            }
            const fromUserExist =await UserModel.findById(fromUserId);
            if(!fromUserExist){
                return res.status(404).send("from user not found");
            }
            // check if the user is not sending request to himself
            if(fromUserId.toString()===toUserId.toString()){
                return res.status(400).send("user cannot send connection request to himself");
            }
            const  connectionRequest =new ConnectionRequestModel({
                fromUserId,
                toUserId,
                status,
            });

            
            //check if the connection request is already  exist between the  two users
            const existingRequest =await ConnectionRequestModel.findOne({
                $or:[   // we will check both the  cases
                    {fromUserId, toUserId},
                    {fromUserId:toUserId, toUserId:fromUserId}
                ],
                
            }) 
            if(existingRequest){
                return res.status(400).send("connection request already exists between the two users");
            }
            
            //create connection request
            const data =await connectionRequest.save();
            res.json({
                message:fromUserExist.firstName + "is " + status + "in " + toUserExist.firstName,
                data
            });

            
    }catch(err){}
})

export default RequestRouter