import express from 'express';


const app=express();// it is instances of express



app.use("/user",(req,res)=>{ // when we use the use method it will handel the all the type od request get,post,delete,put etc
    res.send("hello ghanshyam from user endpoint using use method");
})
app.use("/prfile",(req,res)=>{
    // we are not sending anything on this route so it will hang the request foreveor or infinite loop
    console.log(("hello ghanshyam from profile endpoint using use method"));
})
// on one route we can use only one method at a time why? because each method is used to handel specific type of request
// like get method is used to handel get request only , post method is used to handel post request only etc
app.use("/me",(req,res)=>{   // willl it work ? yes it will work and handel all type of request get,post,delete,put etc
    console.log("hello ghanshyam from me endpoint using use method");
    res.send("hello ghanshyam from me endpoint using use method");
},
(req,res)=>{
    console.log("this is second callback function");
    res.send("this is second callback function response");
})    // it will give response from the first callback function only because response is already sent from the first callback function


app.use("/me",(req,res)=>{   // willl it work ? yes it will work and handel all type of request get,post,delete,put etc
    console.log("hello ghanshyam from me endpoint using use method");
  //  res.send("hello ghanshyam from me endpoint using use method");  
},
(req,res)=>{
    console.log("this is second callback function");
    res.send("this is second callback function response");
}) 
// if i use the next() method in the first callback function then it will pass the control to the second callback function
app.use("/me",(req,res,next)=>{   // willl it work ? yes it will work and handel all type of request get,post,delete,put etc
    console.log("hello ghanshyam from me endpoint using use method");
  //  res.send("hello ghanshyam from me endpoint using use method"); 
  next(); 
},
(req,res)=>{
    console.log("this is second callback function");
    res.send("this is second callback function response");
}) // then it will send the 2nd response from the second callback function 
// next() method is used to pass the control
app.use("/me",(req,res,next)=>{   // willl it work ? yes it will work and handel all type of request get,post,delete,put etc
    console.log("hello ghanshyam from me endpoint using use method");
   res.send("hello ghanshyam from me endpoint using use method"); 
  next(); 
},
(req,res)=>{
    console.log("this is second callback function");
    res.send("this is second callback function response");
})
// what will happen if i call next () but after that no handelr to handel the request
// it will give error because after sending the response there is no handler to handel the request
// so it will give error like cannot set headers after they are sent to the client

app.use("/me",(req,res,next)=>{   // willl it work ? yes it will work and handel all type of request get,post,delete,put etc
    console.log("hello ghanshyam from me endpoint using use method");
    next(); 
   res.send("hello ghanshyam from me endpoint using use method"); 
  
},
(req,res)=>{
    console.log("this is second callback function");
    res.send("this is second callback function response");
})// this is give the  2nd res andalso code will give error because response is already sent from the second callback function
// when the next call it goes to next handler after excuting the is comes to the 1st res.sned again 
// call , it is in callstack but we already sent the res or fulfiled so it will give the error

// app.use("/me",rh1,rh2,rh3,rh3) we can also pass the multiple handler function in the use method
app.get('/user',(req,res,next)=>{    //this will only handel the get call to /user endpoint  
    res.send("hello ghanshyam from user endpoint");
})
app.post('/user',(req,res)=>{   //this will only handel the post call to /user endpoint
    res.send("hello ghanshyam from user endpoint using post method");
})
app.delete('/user',(req,res)=>{ //this will only handel the delete call to /user endpoint
    res.send("hello ghanshyam from user endpoint using delete method");
})
app.use("/",(req,res)=>{
    res.send("hello ghanshyam from express server");
})
app.use("/hello",(req,res)=>{
    res.send("hello from the hello endpoint");
})
app.use("/test",(req,res)=>{
    res.send("hello from the test endpoint");
})

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})