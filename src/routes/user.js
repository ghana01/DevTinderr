import express from "express";
import { userAuth } from "../middleware/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import UserModel from "../models/user.js";



const  UserRouter =express.Router();

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"
//GET all the pending connection request for the loggedIn user
UserRouter.get("/requests",userAuth,async (req,res)=>{

    try{
        const looggedInUser =req.user;
           
        const connectionRequests =await ConnectionRequestModel.find({
            toUserId:looggedInUser._id,  // so for the user who are looged if he/she want to see the all the connection request he get  then we will check the toUserId field
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]); // we are populating the fromUserId to get the user details of the user who sent the request
        res.json({
            message:"connection requests fetched successfully",
            data:connectionRequests
        })
    }catch(err){
            res.status(400).send("Error" + err.message);
    }
})
UserRouter.get("/connection",userAuth,async (req,res)=>{
     

    try{

        const loggedInUser =req.user;
        // find all the user who have accpeted the connection request of loogeed in user
        const connectionRequest =await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
            
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        // now from this connection request we have to extract the user details of the connected user  we have to also take care the loggedin user is either in fromUserId or toUserId field
        const data  =connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() ===loggedInUser._id){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
           connectionRequest
        })
    }catch(err){
        res.status(400).send("Error"+err.message);
    }
})


UserRouter.get("/feed", userAuth, async (req, res) => {

    // find the all the user in our database except the logged in user
        // we show  this data as a feed to the logged in user except the user he is already connected with or the user he has sent request to or the user who has sent request to him
        // and a;sp if the user ignore some profile we should not show that profile again in feed
        //and user can not see his own profile in feed
    try {
        const loggedInUser = req.user;

        // 1. Find all connections
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId"); //selcet is used to fetch only the required field from the document

        // 2. Hide List (Using Set for Uniqueness)
        const hideUsersFromFeed = new Set();// we aresuing the set to store the user ids to be hidden from feed and it does not store any dublicate value
        
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // 3. Hide Myself
        hideUsersFromFeed.add(loggedInUser._id.toString());

        // 4. Find Users (Using Array.from to convert Set -> Array)
        const feedUsers = await UserModel.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        })
        .select("firstName lastName photoUrl age gender about skills") // Check if USER_SAFE_DATA is defined
        .limit(10);

        res.json({ data: feedUsers });

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});
export default UserRouter;
