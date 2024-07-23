import {verJWT} from '../utils/jwt.js';
import Author from '../models/authors.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer', '');

        if(!token) {
            return res.status(401).send('Non autizzato, manca il token')
        }

        const decoded = await verJWT(token);

        const author = await Author.find(decoded.id).select('-password');

        if(!author) {
            return res.status(404).send('Autore non trovato')
        };

        req.author = author;

        next();

    } catch (err) {
        res.status(401).send("Token non valido per l'autenticazione")
    }
}