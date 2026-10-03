import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "./users.js";
import validate from "./validate.js";
import { loginSchema, refreshSchema, registerSchema } from "./validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema) , async (req,res)=>{
    try {
        const username=req.body.username;
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password; 
        
        const existinguser= await users.findOne({
            $or:[
                {   username    },
                {   email   }
            ]
        });

        if(existinguser){
            return res.status(409).json({message:"username or email already exist"})
        }
        else{
            const hashedpassword = await bcrypt.hash(password,15);

            const user = await users.create({
                username,
                name,
                email,
                password:hashedpassword,
                role:"user"
            })

            res.status(201).json({
                message : "User registered successfully",
                userid : user._id})
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Unavailable"});
    }
});

router.post("/login", validate(loginSchema) , async(req,res)=>{
    try {
        const identifier=req.body.identifier;
        const password=req.body.password;

        const existinguser= await users.findOne({
            $or:[
                { username : identifier },
                { email : identifier }
            ]
        });

        if(!existinguser){
            return res.status(401).json({message:"Invalid username/email or password"})
        }
        else{
            const passwordmatch = await bcrypt.compare(password,existinguser.password);

            if(!passwordmatch){
                return res.status(401).json({message:"Inavalid username/email or password"});
            }
            else{
                const access_token = jwt.sign(
                    {
                        userid: existinguser._id,
                        username: existinguser.username,
                        role: existinguser.role
                    },
                    process.env.ACCESS_TOKEN_KEY,
                    {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                    }
                )
                const refresh_token = jwt.sign(
                    {
                        userid: existinguser._id,
                        username: existinguser.username
                    },
                    process.env.REFRESH_TOKEN_KEY,
                    {
                        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
                    }
                )
                existinguser.refreshToken=refresh_token;
                await existinguser.save();
                return res.status(200).json({
                    message:"Login Successful",
                    access_token,
                    refresh_token
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Unavailable"});
    }
});

router.post("/refresh", validate(refreshSchema) , async (req, res) => {
    try {
        const refresh_token = req.body.refresh_token;

        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_KEY
        )
        const id = decoded.userid;
        const existinguser = await users.findById(id);

        if(!existinguser || existinguser.refreshToken!==refresh_token){
            return res.status(401).json({
                message: "Invalid or Expired Reresh token"
            })
        }
    
        const access_token = jwt.sign(
            {
                userid: existinguser._id,
                username: existinguser.username,
                role: existinguser.role
            },
            process.env.ACCESS_TOKEN_KEY,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
        const new_refresh_token = jwt.sign(
            {
                userid: existinguser._id,
                username: existinguser.username
            },
            process.env.REFRESH_TOKEN_KEY,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
        existinguser.refreshToken=new_refresh_token;
        await existinguser.save();
        return res.status(200).json({
            message:"Token refreshed successfully",
            access_token,
            refresh_token:new_refresh_token
        });
    }
    catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or expired refresh token"
            });
        }
        console.log(error);
        res.status(500).json({message:"Server Unavailable"});
    }
});

router.post("/logout", validate(refreshSchema) , async (req, res) => {
    try {
        const refresh_token = req.body.refresh_token;

        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_KEY
        )
        const id = decoded.userid;
        const existinguser = await users.findById(id);
        
        if(!existinguser || existinguser.refreshToken!==refresh_token){
            return res.status(401).json({
                message: "Invalid or Expired Reresh token"
            })
        }

        existinguser.refreshToken=null;
        await existinguser.save();

        return res.status(200).json({
            message:"Logout Successful"
        })

    } 
    catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or expired refresh token"
            });
        }
        console.log(error);
        res.status(500).json({message:"Server Unavailable"});
    }
});

export default router;