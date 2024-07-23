import express from "express";
import Post from "../models/post.js";
import controlloMail from "../middlewares/controlloMail.js";
import upload from "../middlewares/upload.js";
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(controlloMail); 

router.get("/", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limite = parseInt(req.query.limit) || 10;
        const ordinamento = req.query.sort || "nome";
        const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
        const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
        
        let query = {};

        if(req.query.title) {
                query.title = {$regex: req.query.title, $options: 'i'}
                //$options: 'i' = case insensitive
        }

        const posts = await Post.find(query)
            .sort({[ordinamento]: direzOrdine})
            .skip(salta)
            .limit(limite);

        const count = await Post.countDocuments();

        res
            .json({
                posts,
                currentPage: page,
                totalPages: Math.ceil(count / limite),
                totalPost: count,
                message: "Posts caricati con successo"
            });

    } catch (error) {

        res
            .status(500)
            .json({
            message: error.message
        })
    }
})

router.get("/:id", async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                    .status(404)
                    .json({
                        message: "Post non esistente o non trovato"
                    })
        }

        res
            .json({
                post,
                message: "Post caricato con successo"
            });

    } catch (error) {

        res
            .status(500)
            .json({
                message: error.message
            })
    }
})

router.use(authMiddleware);

router.post( '/', cloudinaryUploader.single('cover', async (req, res) => {
    try{
        const postData = req.body;
        if (req.file) {
            postData.cover = req.file.path;
        }
        const newPost = new Post(postData);
        await newPost.save();
        const htmlContent = `
            <h1>Il tuo post è stato pubblicato!</h1>
            <p>Ciao ${newPost.author}</p>
            <p>Il tuo post "${newPost.title}" è stato pubblicato con successo!<p>
            <p>Categoria: ${newPost.category}</p>
            <p>Grazie per il tuo contributo al blog!</p>
        `;
        await sendEmail(newPost.author, 'Il tuo post è stato correttamente pubblicato', htmlContent);
        res.status(201).json(newPost);
    } catch  (err){
        console.error('Errore nella creazione di un nuovo Post')
        res.status(400).json({
            message: err.message
        })
    }
}))

router.put("/:id", async (req, res) => {

    try {

        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if(!updatePost) {
            res
                .status(404)
                .json({
                    message: "Post da aggiornare non presente o non trovato"
                })
        }

        res
            .json({
                updatePost,
                message: "Post aggiornato"
            });

    } catch {

        res
            .status(400)
            .json({
                message: err.message
            });
    }
})

router.delete("/:id", async (req, res) => {

    try {

        const deletePost = await Post.findByIdAndDelete(req.params.id);

        if(!deletePost) {
            res
                .status(404)
                .json({
                    message: "Post da eliminare non presente o non trovato"
                })
        }

        res
            .json({
                message: "Post Eliminato"
            })

    } catch (error) {

        res
            .status(500)
            .json({
            message: err.message
        });
    }
});

router.get("/:id/comments", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                message: "Attento! Commento non trovato"
            })
        };
        res.json(post.comments)
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
});

router.get("/:id/comments/:commentId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                message: "Attento! Post non trovato"
            })
        };
        const comment = post.comment.id(req.params.commentId);
        if(!comment) {
            return res.status(404).json({
                message: "Attento Commento non trovato!"
            })
        }
        res.json(comment);
    } catch(err) {
        return res.status(500).json({
            message: err.message
        });
    }
})

router.post("/:id/comments", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                message: "Attento! Post non trovato"
            })
        }

        const newComment = {
            name: req.body.name,
            email:req.body.email,
            content: req.body.content
        };

        post.comment.push(newComment);

        await post.save()

        res.status(201).json(neewComment);

    } catch  (err) {
        req.status(400).json({
            message: err.message
        })
    }
});

router.put("/:id/comments/:commentId", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                message: "Attento, il posto non viene trovato"
            })
        };
        const comment = post.comments.id(req.params.commentId);

        if(!comment) {
            return res.status(404).json({
                message: "Attento, il commento non è stato trovato"
            });

        }

        
        comment.content = req.body.content;

        await post.save();

        res.json(comment);

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
});

router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            res.status(404).json({
                message: "Attento, post non trovato"
            })
        }

        const comment = post.comment.id(req.params.commentId);
        if(!comment) {
            return res.status(404).json({
                message: "Attento! Commento non trovato"
            })
        };

        comment.remove();

        await post.save();
        
        res.json({
            message: "Commento Eliminato"
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
})
export default router;