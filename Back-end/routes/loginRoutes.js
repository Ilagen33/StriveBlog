import express from "express";
import Author from "../models/authors.js";
import {genJWT} from '../utils/jwt.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/login', async (req, res) => {
    try {

        const {email, password} = req.body;
        const author = await Author.findOne({email});

        if (!author) {
            return res.status(401).json({
                message: "Credenziali non valide (email)"
            })
        };

        const isMatch = await author.comparePassword(password);

        if(!isMatch) {
            return res.status(401).json({
                message: 'Credenziali non valide'
            })
        };

        const token = await genJWT({ id: author._id})

        res.json({ token, message: "Login effettuato con successo"})
    }
    catch (err) {
        console.error("Errore nel login", err)
        res.status(500).json({
            message: "Errore nel server"
        })
    }
})

router.get('/me', authMiddleware, (req, res) => {
    const authorData = req.author.toObject();
    delete authorData.password;
    res.json(authorData);
})

export default router;