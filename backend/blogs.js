import mongoose from "mongoose";

const blogsschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    article:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    deleteSecret:{
        type: String,
        required: true
    }
},{
    timestamps:true
});

const blogs=mongoose.model("Blogs",blogsschema);
export default blogs;