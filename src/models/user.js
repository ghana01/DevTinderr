import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, "Name can only contain letters"],
        minlength: [3, "first name must be at least 3 characters long"]
    },
    lastName: {
        type: String,
        match: [/^[a-zA-Z\s]+$/, "Name can only contain letters"],
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email address" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
        validate: Number.isInteger
    },
    gender: {
        type: String,
        set: value => value ? value.toLowerCase() : value, // Safety check
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender`
        },
        // Note: The enum above handles validation, but if you want custom error:
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
    },
    about: {
        type: String,
        maxLength: 500,
        default: "Hey there! I am using DevTinder"
    },
    
   
    skills: {
        type: [{
            name: { type: String, required: true },
            level: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                default: 'Intermediate'
            },
            yearsOfExperience: { type: Number, default: 0 }
        }],
        validate: [
            (arr) => arr.length <= 20, 
            "you can add maximum 20 skills"
        ]
    },

    headline: {
        type: String,
        maxLength: 120,
        default: "Developer"
    },
    experience: {
        type: Number,
        default: 0
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
            // default: 'Point' // REMOVED to prevent validation error on signup
        },
        coordinates: {
            type: [Number],
            // required: true // Keep this, but it only triggers if 'location' object exists
        }
    },

    phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"]
    },
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        portfolio: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true }); // Added timestamps option (good practice)

// INDEXES
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'skills.name': 1 });

userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: this._id }, "mysecretkey", { expiresIn: "1d" });
    return token;
};

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const passwordHashed = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHashed);
    return isPasswordValid;
}



const UserModel = mongoose.model("User", userSchema);

export default UserModel;