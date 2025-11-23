import express from 'express';
import {adminAuth,userAuth} from "./middleware/auth.js"

const app=express();// it is instances of express
// handel auth for admin routes

app.use("/admin",adminAuth)
app.use("/user",userAuth)
//app.use("/admin")// we can also use  app.all("/admin",(req,res,next)=>{
//     // check if the user is admin or not i means authenticated or not
//     const token=req.headers.authorization;
app.get("admin/grtallusers",(req,res)=>{
    // check if the user is admin or not i means authenticated or not
    const token=req.headers.authorization;
    if(token!=="admin@123"){
        return res.status(401).send("Unauthorized Access");
    }
    res.send("all the data send");
})

app.get("/admin/deleteuser",(req,res)=>{
    res.send("user deleted successfully");
})
// eroor  handeling 
app.use("/",(err,req,res,next)=>{  // err argument alway come first or write first
   if(err){
    res.status(500).send("something went wrong")
   }
})

app.get("/getUserData",(req,res)=>{
    try{
        // logic of Db call andd get user 
        // we write all our logic code here
    }catch(err){
        res.status(500).send("something went wrong")
    }
})



app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})