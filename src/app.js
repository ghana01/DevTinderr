import express from 'express';
import {adminAuth,userAuth} from "./middleware/auth.js"
import  connectDB from "./config/database.js"
import UserModel from "./models/user.js"

const app=express();// it is instances of express
// handel auth for admin routes

app.use(express.json())// middleware to parse json body


app.post("/signup",async (req,res)=>{

    const ALLOWED_FIELDS = ["firstName", "lastName", "emailId", "password", "age", "gender", "skills"];
    // Create a clean object with ONLY allowed keys
    const cleanData = {};
    Object.keys(req.body).forEach(key => {
        if (ALLOWED_FIELDS.includes(key)) {
            cleanData[key] = req.body[key];
        }
    });

    // Now cleanData does NOT have "xyr" inside it at all.
    console.log(cleanData);
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
    const user =new UserModel(req.body);

    try{
        await user.save();
      res.send("user signed up successfully")
    } catch(err){
        res.status(500).send("error in signing up the user: " + err.message);
    }
})

app.get("/user",async (req,res)=>{
    const UserEmail=req.body.emailId;

    try{
           const User =await UserModel.findOne({emailId:UserEmail});
           if(!User){
             res.status(404).send("user not found");
           }
             res.send(User);
    }catch(err){
        res.status(500).send("error in fetching the user")
    }
})
//this is the feed api -GET/feed -get all the users from the database
app.get("/feed",async(req,res)=>{
        try{
         const  users =await UserModel.find({});
            res.send(users);
        }catch(err){
            res.status(500).send("error in fetching users");
        }
})

app.delete("/user",async (req,res)=>{
    const UserEmail=req.body.emailId;

    try{
        await UserModel.deleteOne({emailId:UserEmail});
        res.send("user deleted successfully");
    }catch(err){
        res.status(500).send("error in deleting the user"); 
    }
})

//update the patch   
app.patch("/user",async (req,res)=>{
    const userId=req.body._id;
    const data=req.body;

    try{
        const user = await UserModel.findByIdAndUpdate(userId, data, {new: true, runValidators: true});
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send("user updated successfully");
    }catch(err){
        res.status(500).send("error in updating the user: " + err.message);  
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






