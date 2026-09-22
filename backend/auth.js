import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "./users.js";

const router = express.Router();

router.post("/register",async (req,res)=>{
    try {
        const username=req.body.username;
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password; 
        
        if (!username || !name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        
        const existinguser= await users.findOne({
            $or:[
                {   username    },
                {   email   }
            ]
        });

        if(existinguser){
            return res.status(400).json({message:"username or email already exist"})
        }
        else{
            const hashedpassword = await bcrypt.hash(password,15);

            const user = await users.create({
                username,
                name,
                email,
                password:hashedpassword
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

router.post("/login", async(req,res)=>{
    try {
        const username=req.body.username;
        const email=req.body.email;
        const password=req.body.password;

        if ((!username && !email )|| !password) {
            return res.status(400).json({
                message: "username or email and password are required"
            });
        }

        const existinguser= await users.findOne({
            $or:[
                {   username    },
                {   email   }
            ]
        });

        if(!existinguser){
            return res.status(401).json({message:"Inavalid username/email or password"})
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
                        username: existinguser.username
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

export default router;