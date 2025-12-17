import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const  userSchema =new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, "Name can only contain letters"],
        minlength:[3,"firt name must be at least 3 characters long"]
    },
    lastName:{
        type:String,
         match: [/^[a-zA-Z\s]+$/, "Name can only contain letters"],
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
         maxlength: 254, // RFC limit
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address" + value)
            }
        }

    },
    password:{
        type:String,
        required:true,
        minLength:6, 

    },
    age:{
        type:Number,
        min:18,
        max:100,
        validate: Number.isInteger

    },
   gender: {
    type: String,
    set: value => value.toLowerCase(),

    enum:{
        values:["male","female","others"],
        message: `{VALUE} is not valid gender`
    },
    validate(value) {
        
        // "Male" and "male" should both work
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
            throw new Error("Gender data is not valid"); 
        }
    }
},
    photoUrl:{
        type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
    },
    about:{
        type:String,
        maxLength:500,
        default:"Hey there! I am using DevTinder"
    },
   skills: [{
        name: { type: String, required: true },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Intermediate'
        },
        yearsOfExperience: { type: Number, default: 0 }
    },
    validate:[arr =>arr.length <=20,"you can add maximum 20 skills"

    ]
        
],
    
    // Profile headline like linkedien
    headline:{
        type:String,
        maxLength:120,
        default:"Developer"
    },
    experience:{
        type:Number,
        default:0
    },
    projects: [{
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  githubUrl: {
    type: String,
    validate: v => !v || validator.isURL(v)
  },
  liveUrl: {
    type: String,
    validate: v => !v || validator.isURL(v)
  }
}],

    
    location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
},

    //contact number
    phone:{
        type:String,
        match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"]
    },
    socialLinks:{
        github:String,
        linkedin:String,
        twitter:String,
        portfolio:String,
    }

    
   

    
})

//INDEXES
userSchema.index({firstName:1,lastName:1   }); // compound field indexing on the basis of what we serch we create the indexing 
// we can also create the indeinx with UserSchema.index({email:1})  but creating to  many index in databse also have cost
userSchema.index({location:'2dsphere'}); //geospatial indexing for location field
userSchema.index({'skills.name':1});
userSchema.methods.getJwt = async function (){
    const user =this;
    const token = await jwt.sign({_id:this._id},"mysecretkey",{expiresIn:"1d"});
    return token;
 };
 userSchema.methods.validatePassword = async function (password){
   const user =this;
   const passwordHashed =user.password;
   const isPasswordValid =await bcrypt.compare(password,passwordHashed);
   return isPasswordValid;
 }
const UserModel = mongoose.model("User",userSchema);

 

export default UserModel;