import express from "express";
import mongoose from "mongoose";
import redis from "./redis.js";
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
import sanitizeBlogContent from "./sanitize.js";

const app=express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use("/auth", authlimit , router);

const LIST_TTL = process.env.REDIS_TIME_LIMIT;

async function blogListKey(page, limit) {
    const version = (await redis.get("blogs:version")) || "0";
    return `blogs:list:v${version}:p${page}:l${limit}`;
}

async function invalidateBlogCache() {
    try {
        await redis.incr("blogs:version");
    } catch (error) {
        console.log("Cache invalidation failed:", error.message);
    }
}

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

app.get('/blogs/me', readbloglimit, verifytoken, async (req, res) => {
    try {
        const search = req.query.search?.trim();

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
        const skip = (page - 1) * limit;

        const query = { author: req.user.userid };

        if (search) {
            const escsearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.$or = [
                { title: { $regex: escsearch, $options: "i" } },
                { content: { $regex: escsearch, $options: "i" } }
            ];
        }

        const [myblogs, total] = await Promise.all([
            blogs.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            blogs.countDocuments(query)
        ]);

        return res.status(200).json({
            blogs: myblogs,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server unavailable"
        });
    }
});

app.get('/blogs', readbloglimit, async (req, res) => {
    try {
        const search = req.query.search?.trim();

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
        const skip = (page - 1) * limit;

        const useCache = !search;
        let cacheKey;

        if (useCache) {
            try {
                cacheKey = await blogListKey(page, limit);
                const cached = await redis.get(cacheKey);

                if (cached) {
                    return res.status(200).json(JSON.parse(cached));
                }
            } catch (error) {
                console.log("Cache read failed:", error.message);
            }
        }

        let query = {};

        if (search) {
            const escsearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query = {
                $or: [
                    { title: { $regex: escsearch, $options: "i" } },
                    { content: { $regex: escsearch, $options: "i" } }
                ]
            };
        }

        const [result, total] = await Promise.all([
            blogs
                .find(query)
                .populate("author", "name username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            blogs.countDocuments(query)
        ]);

        const publicBlogs = result.map((blog) => {
            const blogData = blog.toObject();

            if (blogData.anonymous) {
                blogData.author = null;
            }

            return blogData;
        });

        const payload = {
            blogs: publicBlogs,
            page,
            totalPages: Math.ceil(total / limit),
            total
        };

        if (useCache && cacheKey) {
            try {
                await redis.set(cacheKey, JSON.stringify(payload), { EX: LIST_TTL });
            } catch (error) {
                console.log("Cache write failed:", error.message);
            }
        }

        return res.status(200).json(payload);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({ error: "Server Unavailable" });
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
        
        const cleanContent = sanitizeBlogContent(content);

        const newBlog = await blogs.create({
            title: title.trim(),
            content: cleanContent,
            author: author,
            anonymous: anonymous
        });
        await invalidateBlogCache();
        res.status(201).json(newBlog);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.put('/blogs/:id', createbloglimit ,verifytoken , validate(updateBlogSchema) , async (req , res) => {
    const id=req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }
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
            blog.content=sanitizeBlogContent(content.trim());
        }
        if(anonymous!==undefined){
            if(typeof(anonymous)!=="boolean"){
                return res.status(400).json({message:"Anonymous must be boolean"})
            }
            blog.anonymous=anonymous;
        }
        await blog.save();
        await blog.populate("author", "name username");
        await invalidateBlogCache();
        return res.status(200).json({message:"Blog updated successfully",blog});
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
            return res.status(404).json({message:"Blog not found"});
        else{
            if(blog.author.toString()===req.user.userid.toString()){
                await blogs.findByIdAndDelete(id);
                await invalidateBlogCache();
                res.json({message: "Blog Deleted Successfully"});
            }
            else{
                return res.status(403).json({message:"You can only delete your blog"});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Server Unavailable"});
    }
});

// =========================
// ARTICLES ROUTES
// =========================

app.get('/articles', readbloglimit, async (req, res) => {
    try {
        const search = req.query.search?.trim();

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            const escsearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query = {
                $or: [
                    { title: { $regex: escsearch, $options: "i" } },
                    { content: { $regex: escsearch, $options: "i" } },
                    { category: { $regex: escsearch, $options: "i" } }
                ]
            };
        }

        const [result, total] = await Promise.all([
            articles.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            articles.countDocuments(query)
        ]);

        res.json({
            articles: result,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.log(error);
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
