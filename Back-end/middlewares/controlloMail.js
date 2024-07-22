const controlloMail = (req, res, next) => {
    const emailAutorizzata = "autorized@gmail.com";
    const mailUtente = req.headers['user-mail'];

    if (emailAutorizzata === mailUtente) {

        next();

    } else {

        res
            .status(403)
            .json({
                message: "Accesso non autorizzato"
        })
    }
}

export default controlloMail;