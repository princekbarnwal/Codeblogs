import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 8,
            maxlength: 20,
            match: /^[a-z0-9._]+$/
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user","admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

const users=mongoose.model("Users",userSchema);
export default users;