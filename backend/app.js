import express from "express";
import mongoose from "mongoose";
import blogs from "./blogs.js";
import articles from "./articles.js";
import quotes from "./quotes.js";
import cors from "cors";
import bcrypt from "bcrypt";
import router from "./auth.js";

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

app.get('/blogs',async (req,res)=>{
    try {
        const blog = await blogs.find();
        res.json(blog);
    } 
    catch (error) {
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.get('/blogs/:id',async (req,res)=>{
    const id=req.params.id;
    try {
        const blog = await blogs.findById(id);
        if(!blog)
            res.status(404).json("Blog not found");
        else{
            const blog = await blogs.findById(id);
            res.json(blog);
        }
    } 
    catch (error) {
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.post('/blogs',async (req,res)=>{
    const title=req.body.title;
    const article=req.body.article;
    const name=req.body.name;
    try {
        const newBlog = await blogs.create({
            title: title,
            article: article,
            name: name
        });
        res.status(201).json(newBlog);
    } 
    catch (error) {
        res.status(500).json({error:"Server Unavailable"});
    }
});

app.delete('/blogs/:id', async(req,res)=>{
    const id=req.params.id;
    const secret=req.body.secret;
    try {
        const blog = await blogs.findById(id);
        if(!blog)
            res.status(404).json("Blog not found");
        else{
            const match=await bcrypt.compare(secret, blog.deleteSecret);
            if(match){
                await blogs.findByIdAndDelete(id);
                res.json({message: "Blog Deleted Successfully"});
            }
            else
                res.status(401).json("Unauthorized");
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

app.post('/articles', async (req, res) => {
    const { title, content, name, category, sourceUrl, deleteSecret } = req.body;
    try {
        const hashedSecret = await bcrypt.hash(deleteSecret, 10);
        const newArticle = await articles.create({
            title,
            content,
            name,
            category,
            sourceUrl: sourceUrl || "",
            deleteSecret: hashedSecret,
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

app.delete('/articles/:id', async (req, res) => {
    const id = req.params.id;
    const secret = req.body.secret;
    try {
        const article = await articles.findById(id);
        if (!article)
            res.status(404).json("Article not found");
        else {
            const match = await bcrypt.compare(secret, article.deleteSecret);
            if (match) {
                await articles.findByIdAndDelete(id);
                res.json({ message: "Article Deleted Successfully" });
            } else {
                res.status(401).json("Unauthorized");
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Server Unavailable" });
    }
});

export default app;
