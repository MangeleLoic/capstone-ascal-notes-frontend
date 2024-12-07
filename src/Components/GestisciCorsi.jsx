import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GestisciCorsi() {
  const [corsi, setCorsi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0); 

  const fetchCorsi = async (currentPage) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato. Effettua il login.");
      }

      const response = await fetch(
        `http://localhost:3001/corsi?page=${currentPage}&size=10&sortBy=id`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Errore durante il recupero dei corsi. Verifica l'autenticazione."
        );
      }

      const data = await response.json();
      setCorsi(data.content); 
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorsi(page); 
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo corso?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/corsi/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          setCorsi(corsi.filter((corso) => corso.id !== id)); 
        } else {
          throw new Error("Errore durante la cancellazione del corso.");
        }
      } catch (error) {
        console.error("Errore:", error);
        alert("Non è stato possibile eliminare il corso. Riprova.");
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Corsi</h2>
      <div className="row mb-3">
        <div className="col">
          <Link className="btn btn-primary me-1" to="/admin/corso/aggiungi" role="button">
            Aggiungi un Corso
          </Link>
          <button type="button" className="btn btn-outline-primary" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
        <div className="col"></div>
      </div>
      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Codice</th>
                <th>Descrizione</th>
                <th>Facoltà</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {corsi.map((corso) => (
                <tr key={corso.id}>
                  <td>{corso.id}</td>
                  <td>{corso.nome}</td>
                  <td>{corso.codice}</td>
                  <td>{corso.descrizione}</td>
                  <td>{corso.facolta}</td>
                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <Link className="btn btn-primary btn-sm me-1" to={`/admin/corso/modifica/${corso.id}`}>
                      Modifica
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(corso.id)}
                    >
                      Cancella
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Precedente
            </button>
            <span>
              Pagina {page + 1} di {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
            >
              Successiva
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GestisciCorsi;
