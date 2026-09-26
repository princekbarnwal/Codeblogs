import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin"
    },
    category: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
