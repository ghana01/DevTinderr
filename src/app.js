import express from 'express';


const app=express();// it is instances of express



app.use("/",(req,res)=>{
    res.send("hello ghanshyam from express server");
})
app.use("/test",(req,res)=>{
    res.send("hello from the test endpoint");
})

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})