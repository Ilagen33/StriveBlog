import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authorRoutes from './routes/authorRoutes.js'
import postRoutes from './routes/postRoutes.js';
import cors from "cors";
import {
    badRequestHandler,
    authorizedHandler,
    notFoundHandler,
    genericErrorHandler
} from "./middlewares/handleError.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("DB connesso"))
    .catch((err) => console.error("DB: errorre nella connessione", err));

const PORT = process.env.PORT || 5000;

app.use("/api/authors", authorRoutes);
app.use ("/api/posts", postRoutes);
app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}. Sono disponibili i seguenti endpoints:`);
    console.table(endpoints(app));
})