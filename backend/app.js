import express from "express";
import mongoose from "mongoose";
import blogs from "./blogs.js";
import articles from "./articles.js";
import quotes from "./quotes.js";
import cors from "cors";
import router from "./auth.js";
import verifytoken from "./middleware.js";
import verifyadmin from "./admin.middleware.js";
import users from "./users.js";

const app=express();

app.use(cors());
app.use(express.json());
app.use("/auth",router);

async function connectdb() {
    try {
        const MONGO_URI="mongodb://localhost:27017/Codeblogs";
        await mongoose.connect(MONGO_URI);
        console.log("MONGO_DB connected successfully");
        
    } catch (error) {
        console.error("error fetching data");
    }
}
await connectdb();

app.get('/quotes', (req,res)=>{
    const quote= quotes[Math.floor(Math.random() * quotes.length)];
    res.json(quote);
});

app.get('/users/:username' , async (req, res)=>{
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
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.get('/blogs/me' , verifytoken, async (req, res)=>{
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

app.get('/blogs',async (req,res)=>{
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

app.get('/blogs/:id',async (req,res)=>{
    const id=req.params.id;
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

app.post('/blogs', verifytoken , async (req,res)=>{
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

app.delete('/blogs/:id',  verifytoken , async(req,res)=>{
    const id=req.params.id;
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

app.get('/articles', async (req, res) => {
    try {
        const all = await articles.find().sort({ createdAt: -1 });
        res.json(all);
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

app.get('/articles/:id', async (req, res) => {
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

app.post('/articles', verifytoken, verifyadmin,  async (req, res) => {
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

app.delete('/articles/:id', verifytoken, verifyadmin, async (req, res) => {
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
