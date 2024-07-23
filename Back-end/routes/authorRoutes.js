import express from "express";
import Author from "../models/authors.js";
import Post from "../models/post.js"

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        //PAGINAZIONE
        const page = parseInt(req.query.page) || 1;
        const limite = parseInt(req.query.limit) || 10;
        const ordinamento = req.query.sort || "nome";
        const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
        const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
      
        const authors = await Author.find({})
            .sort({[ordinamento]: direzOrdine})
            .skip(salta)
            .limit(limite);
        
        const totale = await Author.countDocuments();

        res
            .json({
                authors,
                currentPage: page,
                totalPages: Math.ceil(totale/limite), //ceil approssima per eccesso, il rapporto tra il totale degli elementi e il limite delle pagine, in questo modo ottengo il numero di pagine totali
                totalAuthors: totale,
                message: "Autori caricati con successo"
            });

    } catch (err) {

        res
            .status(500)
            .json({
                message: err.message 
            }); 
    }
});

router.get("/:id", async (req, res) => {

    try {

        const author = await Author.findById(req.params.id);

        if (!author) {
            return res
                    .status(404)
                    .json({ 
                        message: "Autore non presente o non trovato" 
                    });
        }

        res
            .json({
                author,
                message: "Autore caricato con successo"
            });

    } catch (err) {

        res
            .status(500)
            .json({ 
                message: err.message
            }); 
    }
});

router.get("/:id/Posts", async (req, res) => {

    try {

        const author = await Author.findById(req.params.id);

        if (!author) {
            return res
                    .status(404)
                    .json({ 
                        message: "Autore non presente o non trovato" 
                    });
        }

        const post= await Post.find({
            author: author.email,
        })

        res
            .json({
                post,
                message: `Post dell'autore ${post.author} caricato con successo`
            });

    } catch (err) {

        res
            .status(500)
            .json({ 
                message: err.message
            }); 
    }
});

router.post("/", async (req, res) => {

    try {

        const author = new Author(req.body); //crea un nuovo autore prendendo i dati dal corpo della richiesta
        const newAuthor = await author.save();
        const authorResponse = newAuthor.toObject();
        delete authorResponse.password;
        
        res
            .status(201)
            .json({
                authorResponse,
                message: "Nuovo autore aggiunto"
            });

    } catch (err) {

        res
            .status(400)
            .json({ 
                message: err.message
            });
    }
});

router.put("/:id", async (req, res) => {

    try {

        const updateAuthor = await Author.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true},
        );

        if(!updateAuthor) {
            return res
                    .status(404)
                    .json({
                        message: "Autore da aggiornare non presente o non trovato"
                    });
        };

        res.json({
            updateAuthor,
            message: "Autore aggiornato"
        });

    } catch (err) {

        res
            .status(400)
            .json({
                message: err.message
            });
    }
});

router.delete("/:id", async (req, res) => {

    try {

        const deleteAuthor = await Author.findByIdAndDelete(req.params.id);

        if(!deleteAuthor) {
            res
                .status(404)
                .json({
                    message: "Autore da eliminare non presente o non trovato"
                })
        }

        res
            .json({
                message: "Autore eliminato"
            });

    } catch (err) {

        res
            .status(500)
            .json({ 
                message: err.message
            });
    }
})

export default router;