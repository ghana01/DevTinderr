import jwt from "jsonwebtoken"

import UserModel from "../models/user.js"

export const userAuth = async(req, res, next) => {
   
    // Read the token from req cookies 
    try {
        const {token} = req.cookies;
        
        if(!token) {
            throw new Error("token not found");
        }
        
        // Validate the token
        const decodedObj = await jwt.verify(token, "mysecretkey");
        
        console.log("Decoded token:", decodedObj); // Debug: Check what's in the token
        
        const {_id} = decodedObj;
        
        console.log("Looking for user with ID:", _id); // Debug: Check the ID
        
        // Find the user from the database
        const user = await UserModel.findById(_id);
        
        console.log("User found:", user); // Debug: Check if user exists
        
        if(!user) {
            return res.status(404).send("user not found");
        }
        
        req.user = user;
        next();

    } catch(err) {
        return res.status(400).send("ERROR: " + err.message);
    }
}