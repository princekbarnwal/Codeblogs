import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import blogs from "./blogs.js";
import articles from "./articles.js";
import quotes from "./quotes.js";
import cors from "cors";
import router from "./auth.js";
import verifytoken from "./middleware.js";
import verifyadmin from "./admin.middleware.js";
import users from "./users.js";
import "dotenv/config";
import { authlimit , createbloglimit , readbloglimit } from "./ratelimiter.js";
import validate from "./validate.js";
import { createBlogSchema , updateBlogSchema } from "./validation.js";

const app=express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/auth", authlimit , router);

app.get('/quotes', readbloglimit , (req,res)=>{
    const quote= quotes[Math.floor(Math.random() * quotes.length)];
    res.json(quote);
});

app.get('/users/:username' , readbloglimit , async (req, res)=>{
    try {
        const user = await users.findOne({
            username : req.params.username
        });
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        else{
            const blogcount = await blogs.countDocuments({
                author: user._id
            })
            const latestblog = await blogs.findOne({author : user._id})
            .sort({ createdAt : -1})
            .select(" title content createdAt");

            return res.status(200).json({
                username : user.username,
                name : user.name,
                blogCount : blogcount,
                joinedAt : user.createdAt,
                latestBlog : latestblog
            })
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.get('/blogs/me' , readbloglimit ,verifytoken, async (req, res)=>{
    try {
        const myblogs = await blogs.find({author: req.user.userid})
        .sort({createdAt: -1});

        return res.status(200).json(myblogs)
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server unavailable"
        })
    }
});

app.get('/blogs', readbloglimit , async (req,res)=>{
    try {
        const search = req.query.search?.trim();

        let query = {};

        if(search){
            const escsearch = search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

            query = {
                $or:[
                    {title: {$regex: escsearch, $options: "i"}},
                    {content: {$regex: escsearch, $options: "i"}}
                ]
            }
        }
        const result = await blogs.find(query).populate("author", "name username").sort({createdAt:-1});
        const publicBlogs = result.map((blog) => {
            const blogData = blog.toObject();

            if (blogData.anonymous) {
                blogData.author = null;
            }

            return blogData;
        });
        return res.status(200).json(publicBlogs);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.get('/blogs/:id', readbloglimit , async (req,res)=>{
    const id=req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }
    try {
        const blog = await blogs.findById(id).populate("author","name username");
        if(!blog)
            return res.status(404).json("Blog not found");
        else{
            const blogData = blog.toObject();

            if (blogData.anonymous) {
                blogData.author = null;
            }

            return res.status(200).json(blogData);
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.post('/blogs', createbloglimit , verifytoken , validate(createBlogSchema) , async (req,res)=>{
    const title=req.body.title;
    const content=req.body.content;
    const author=req.user.userid;
    const anonymous = req.body.anonymous ?? false;
    try {
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }
        if (typeof anonymous !== "boolean") {
            return res.status(400).json({
                message: "Anonymous must be a boolean"
            });
        }
        const newBlog = await blogs.create({
            title: title.trim(),
            content: content,
            author: author,
            anonymous: anonymous
        });
        res.status(201).json(newBlog);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.put('/blogs/:id', createbloglimit ,verifytoken , validate(updateBlogSchema) , async (req , res) => {
    const id=req.params.id;
    const title=req.body.title;
    const content=req.body.content;
    const anonymous = req.body.anonymous;
    try {
        const blog = await blogs.findById(id);
        if(!blog)
            return res.status(404).json({message:"Blog not found"});
        if(blog.author.toString()!==req.user.userid.toString())
            return res.status(403).json({message:"You can only update your blog"});
        if(title!==undefined){
            if(typeof(title)!=="string" || !title.trim()){
                return res.status(400).json({message:"title can not be empty"})
            }
            blog.title=title.trim();
        }
        if(content!==undefined){
            if(typeof(content)!=="string" || !content.trim()){
                return res.status(400).json({message:"content can not be empty"})
            }
            blog.content=content.trim();
        }
        if(anonymous!==undefined){
            if(typeof(anonymous)!=="boolean"){
                return res.status(400).json({message:"Anonymous must be boolean"})
            }
            blog.anonymous=anonymous;
        }
        await blog.save();
        return res.status(200).json({message:"Blog upddated successfully",blog});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.delete('/blogs/:id', createbloglimit , verifytoken , async(req,res)=>{
    const id=req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }
    try {
        const blog = await blogs.findById(id);
        if(!blog)
            return res.status(404).json("Blog not found");
        else{
            if(blog.author.toString()===req.user.userid.toString()){
                await blogs.findByIdAndDelete(id);
                res.json({message: "Blog Deleted Successfully"});
            }
            else{
                return res.status(403).json({message:"You can only delete your blog"});
            }
        }
    } catch (error) {
        res.status(500).json({error:"Server Unavailable"});
    }
});

// =========================
// ARTICLES ROUTES
// =========================

app.get('/articles', readbloglimit , async (req, res) => {
    try {
        const all = await articles.find().sort({ createdAt: -1 });
        res.json(all);
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

app.get('/articles/:id', readbloglimit , async (req, res) => {
    const id = req.params.id;
    try {
        const article = await articles.findById(id);
        if (!article)
            res.status(404).json("Article not found");
        else
            res.json(article);
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

app.post('/articles', createbloglimit , verifytoken, verifyadmin,  async (req, res) => {
    const { title, content, category, sourceUrl} = req.body;
    try {
        const newArticle = await articles.create({
            title,
            content,
            category,
            sourceUrl: sourceUrl || ""
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

app.delete('/articles/:id', createbloglimit , verifytoken, verifyadmin, async (req, res) => {
    const id = req.params.id;
    try {
        const article = await articles.findById(id);
        if (!article)
            res.status(404).json("Article not found");
        else {
            await articles.findByIdAndDelete(id);
            res.json({ message: "Article Deleted Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

export default app;
