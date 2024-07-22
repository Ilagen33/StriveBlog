import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {

      name: { 
        type: String, 
        required: true 
    },
      email: { 
        type: String, 
        required: true 
    },
      content: { 
        type: String, 
        required: true },
    },
    {
      timestamps: true,
      _id: true, // darò ad ogni commento un suo id 
    },
  );

const postSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        cover: {
            type: String,
            trim: true,
        },

        readTime: {
            value: {
                type: Number,
                default: 0,
                min: 0,
            },
            unit: {
                type: String,
                default: "Minuti" 
            },
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        collection: "posts",
        timestamps: true,
        comments: [commentSchema],
    }
);

const Post = model("Post", postSchema);

export default Post;