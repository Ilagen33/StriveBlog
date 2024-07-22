import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb = callback
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const suffix= Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname))
    }
});

const upload = multer ({
    storage: storage
});

export default upload;