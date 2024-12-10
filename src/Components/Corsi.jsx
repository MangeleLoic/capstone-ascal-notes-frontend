import React, { useEffect, useState } from "react";

function Corsi() {
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
        throw new Error("Errore durante il recupero dei corsi. Verifica l'autenticazione.");
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

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <>
    <div className="appunti-container py-2">
    <div className="container my-4">
      
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
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="d-flex justify-content-between mt-3">
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
    </div>
    </>
  );
}

export default Corsi;
