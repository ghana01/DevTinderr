import express from 'express';
import {adminAuth,userAuth} from "./middleware/auth.js"
import  connectDB from "./config/database.js"
import UserModel from "./models/user.js"

const app=express();// it is instances of express
// handel auth for admin routes


app.post("/signup",async (req,res)=>{
     // creating a new instacnes of the user model
    const user = new UserModel({
        firstName:"ghanshyam",
        lastName:"mishra",
        emailId:"akshay@saini.com",
        password:"akshay123",
        age:26,
        gender:"male"
    })

    try{
        await user.save();
      res.send("user signed up successfully")
    } catch(err){
        res.status(500).send("error in signing up user  ")
    }

   
   
})





connectDB().then(()=>{
    console.log("DB successfully connected");
    app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})
}).catch((err)=>{
    console.log("DB connection failed",err);
})   // this is the way to connect data base 






