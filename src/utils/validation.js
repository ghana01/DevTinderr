import validator from "validator";

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} =req.body;
    if(!firstName  || !lastName){
        throw new Error("first name and last name are not valid ");
    }
    else if(firstName.length <4 || firstName.length >50){
        throw new Error("first name must be between 4 to 50 characters");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email id is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong enough");
    }
}
const validateEditProfileData =  (req) =>{
    const AllowedEditVariable =["firstName","lastName","age","gender",
        "about","skills","photoUrl","password"];
    
    const isAllowed= Object.keys(req.body).every(field =>AllowedEditVariable.includes(field));
    return isAllowed;

};
export {validateSignUpData, validateEditProfileData};