import React, { useEffect, useState } from "react";
import SingleAuthor from "./SingleAuthor";

function Author() {

    const [author, setAuthor] = useState([])
    const [newAuthor, setNewAuthor] = useState({nome:'', cognome:'', email:'', dataDiNascita:'', avatar:''})
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(10)
    
    useEffect(() => {
        fetch(`http://localhost:5001/?page=${currentPage}&limit=${limit}` )
            .then(response => response.json())
            .then((data) => {
                setAuthor(data.authors)
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage)
                console.log(data.authors)
            })
            .catch((err) => (console.error("Oh no!", err)))
    }, [currentPage, limit]) 
    
    const postAuthor = (e) => {
        e.preventDefault();

        fetch('http://localhost:5001/', {
            method: 'POST',
            headers: {
                    'Content-Type':'application/json'
            },
            body:JSON.stringify(newAuthor)
        })
        .then(response => response.json())
        .then(data => {
            setAuthor([...author, data])
            setNewAuthor({nome:'', cognome:'', email:'', dataDiNascita:'', avatar:''})
        })
        .catch((err) => (console.error("Oh no!", err)))
    }

    const deleteAuthor = (id) => {
        fetch('http://localhost:5001/' + id, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            setAuthor(author.filter((author) => author._id !== id))
        })
        .catch(err => console.error('Oh cacchio!', err))
    }

    return ( 
        <>
            <ul>
                {author.map((dati) => (
                    <SingleAuthor 
                        dati={dati} 
                        key={dati._id} 
                        deleteAuthor={deleteAuthor}
                    />
                ))}
            </ul>

            <form onSubmit={postAuthor}>
                <input type="text" value={newAuthor.nome} onChange={(e) => setNewAuthor({...newAuthor, nome:e.target.value})} required/>
                <input type="text" value={newAuthor.cognome} onChange={(e) => setNewAuthor({...newAuthor, cognome:e.target.value})} required/>
                <input type="text" value={newAuthor.email} onChange={(e) => setNewAuthor({...newAuthor, email:e.target.value})} required />
                <input type="text" value={newAuthor.dataDiNascita} onChange={(e) => setNewAuthor({...newAuthor, dataDiNascita:e.target.value})} required/>
                <input type="text" value={newAuthor.avatar} onChange={(e) => setNewAuthor({...newAuthor, avatar:e.target.value})} required/>
                <button type="submit">+</button>
            </form>
            <div>
                <button onClick={() => setCurrentPage(currentPage-1)} disabled = {currentPage === 1}>Back</button>
                <p>{currentPage}/{totalPages}</p>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
        </>
    )
} 

export default Author;