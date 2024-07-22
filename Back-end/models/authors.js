import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
       nome: {
        type: String,
        required: true,
        trim: true,
       },

       cognome: {
        type: String,
        required: true,
        trim: true,
       },

       email: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
       },

       dataDiNascita: {
        type: String,
        required: true,
        trim: true,
       },

       avatar: {
        type: String,
        required: false,
        trim: true,
       },
    },
    {
       collection: "authors",
       timestamps: true, 
    }
);

const Author = model("Author", authorSchema);

export default Author;