import mongoose from "mongoose";

const blogsschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true
    },
    anonymous:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true
});

blogsschema.index({ createdAt: -1 });
blogsschema.index({ author: 1, createdAt: -1 });

const blogs=mongoose.model("Blogs",blogsschema);
export default blogs;