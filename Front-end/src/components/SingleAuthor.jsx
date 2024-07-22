import React from "react";

function SingleAuthor({dati, deleteAuthor}) {    
    
    return ( 
        <>
            <h2>{dati.nome} {dati.cognome}</h2>
            <h3>{dati.email}</h3>
            <p>{dati.dataDiNascita}</p>
            <img src={dati.avatar} alt="Avatar Author" />
            <button onClick={() => deleteAuthor(dati._id)}></button>
        </>
    )
} 

export default SingleAuthor;

