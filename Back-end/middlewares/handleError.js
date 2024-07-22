export const badRequestHandler = (err, req, res, next) => {
    if(err.status === 400 || err.name === "ValidationError") {
        res.status(400).json({
            error: "Richiesta non valida",
            message: err.message,
            message: "Sembra che non hai l'autorizzazione, riprova effettuando l'autenticazione"
        })
    } else {
        next(err);
    }
};

export const authorizedHandler = (err, req, res, next) => {
    if(err.status === 401) {
        res.status(401).json({
            error: "Errore di autenticazione",
            message: "Effettua nuova autenticazione",
            message: err.message,
        })
    } else {
        next(err);
    }
};

export const notFoundHandler = (err, req, res) => {
    res.status(404).json({
        error: "Risorsa non trovata",
        message: "Sembra che la risorsa non sia stata trovata, riprova"
    })
}

export const genericErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: "Errore Generico",
    })
}