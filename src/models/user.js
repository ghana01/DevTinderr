import mongoose from "mongoose";
import validator from 'validator';
const  userSchema =new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength:3
    },
    lastName:{
        type:String,
        
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
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
        min:18

    },
   gender: {
    type: String,
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
        default:"Hey there! I am using DevTinder"
    },
    skills:{  // igf we want to store many values in a single field
        type:[String]
    }
    
})
const UserModel = mongoose.model("User",userSchema);

 userSchema.methods.getJwt = async function (){
    const user =this;
    const token = await jwt.sign({id:this._id},"mysecretkey",{expiresIn:"1d"});
    return token;
 };
 userSchema.methods.validatePassword = async function (password){
   const user =this;
   const passwordHashed =user.password;
   const isPasswordValid =await bcrypt.compare(password,passwordHashed);
   return isPasswordValid;
 }

export default UserModel;