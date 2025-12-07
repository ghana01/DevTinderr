import express from 'express';
import {userAuth} from "./middleware/auth.js"

const RequestRouter =express.Router();


app.get("/connectionrequest" ,userAuth,async (req,res)=>{
    try{
            const user =req.user;

            console.log("connection request received"
                
            );
            res.send(user.firstName +" send the connection request");
    }catch(err){}
})

export default RequestRouter