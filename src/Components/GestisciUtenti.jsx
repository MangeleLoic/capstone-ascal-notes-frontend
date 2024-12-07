import React from "react"
import { Link } from "react-router-dom"

function GestisciUtenti() {
    return(
        <div className="container my-4">
            <h2 className="text-center mb-4"> Utenti </h2>

<table className="table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Codice</th>
            <th>Descrizione</th>
            <th>Facolta</th>
        </tr>
    </thead>
    </table>   

        </div>

       
    )
}
export default GestisciUtenti