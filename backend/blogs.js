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
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true
    }
},{
    timestamps:true
});

const blogs=mongoose.model("Blogs",blogsschema);
export default blogs;