import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function GestisciAppunti() {
  const [appunti, setAppunti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  


  const fetchAppunti = async (currentPage) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token non trovato. Effettua il login.");
        navigate("/login");
        return;
      }
      

      const response = await fetch(
        `http://localhost:3001/appunti?page=${currentPage}&size=10&sortBy=id`,
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
          "Errore durante il recupero degli appunti"
        );
      }

      const data = await response.json();
      setAppunti(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppunti(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo appunto?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/appunti/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          setAppunti(appunti.filter((appunti) => appunti.id !== id));
        } else {
          throw new Error("Errore durante la cancellazione dell'appunto.");
        }
      } catch (error) {
        console.error("Errore:", error);
        alert("Non è stato possibile eliminare l'appunto. Riprova.");
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
    <>
     <div className="appunti-container py-2">
   
    <div className="container my-4">
     
      <div className="row mb-3">
        <div className="col">
          <Link
            className="btn btn-primary me-1"
            to="/appunti/aggiungi"
            role="button"
          >
            Aggiungi un Appunto
          </Link>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => fetchAppunti(page)}
          >
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
      <th>Titolo</th>
      <th>Contenuto</th>
      <th>Corso</th>
      <th>Utente</th>
      <th>Data Creazione</th>
      <th>Allegati</th>
      <th>Azione</th>
    </tr>
  </thead>
  <tbody>
    {appunti.map((appunto) => (
      <tr key={appunto.id}>
        <td>{appunto.id}</td>
        <td>{appunto.titolo}</td>
        <td>{appunto.contenuto}</td>
        <td>{appunto.corso?.nome || 'N/A'}</td>
        <td>{appunto.utente?.username || 'N/A'}</td>
        <td>
          {new Date(appunto.dataCreazione).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </td>
        <td>
          {appunto.allegati && appunto.allegati.length > 0 ? (
            appunto.allegati.map((allegato) => (
              <div key={allegato.id}>
                <a href={allegato.path} target="_blank" rel="noopener noreferrer">
                  Visualizza Allegato
                </a>
              </div>
            ))
          ) : (
            'Nessun Allegato'
          )}
        </td>
        <td style={{ width: "10px", whiteSpace: "nowrap" }}>
          <Link
            className="btn btn-primary btn-sm me-1"
            to={`/appunti/modifica/${appunto.id}`}
          >
            Modifica
          </Link>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(appunto.id)}
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
    </div>
    </>
  );
}

export default GestisciAppunti;
