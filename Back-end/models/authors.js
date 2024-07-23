import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

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

       password: {
         type: String,
         required: true,
       }

    },
    {
       collection: "authors",
       timestamps: true, 
    }
);

authorSchema.methods.comparePassword = function(candidatePassword) {
   return bycript.compare(candidatePassword, this.password);
};

authorSchema.pre('save', async function(next) {
   if(!this.isModified('password')) return next();

   try {

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      
      next()

   } catch (err) {

      next(err);
   }

})

const Author = model("Author", authorSchema);

export default Author;