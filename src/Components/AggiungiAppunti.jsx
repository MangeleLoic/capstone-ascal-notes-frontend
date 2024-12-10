import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AggiungiAppunto() {
  const [formData, setFormData] = useState({
    titolo: "",
    contenuto: "",
    corsoId: "",
  });
  const [corsi, setCorsi] = useState([]);
  const [utenteId, setUtenteId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchCorsi = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/corsi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nel recupero dei corsi.");
        }

        const data = await res.json();
        setCorsi(data.content); 
      } catch (e) {
        setError(e.message);
      }
    };

    fetchCorsi();
  }, []);

  
  useEffect(() => {
    const fetchUtente = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/utenti/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Errore nel recupero dei dati dell'utente.");
        }

        const data = await res.json();
        setUtenteId(data.id); 
      } catch (e) {
        setError(e.message);
      }
    };

    fetchUtente();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titolo || !formData.contenuto || !formData.corsoId) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/appunti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, utenteId }), 
      });

      if (!res.ok) {
        throw new Error("Errore nell'aggiungere l'appunto.");
      }

      navigate("/appunti");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Aggiungi Appunto</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Titolo</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Contenuto</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  name="contenuto"
                  rows="3"
                  value={formData.contenuto}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Corso</label>
              <div className="col-sm-8">
                <select
                  className="form-control"
                  name="corsoId"
                  value={formData.corsoId}
                  onChange={handleChange}
                >
                  <option value="">Seleziona un corso</option>
                  {corsi.map((corso) => (
                    <option key={corso.id} value={corso.id}>
                      {corso.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-flex">
                <button type="submit" className="btn btn-primary">
                  Aggiungi
                </button>
              </div>
              <div className="col-sm-4 d-flex">
                <a className="btn btn-secondary" href="/appunti" role="button">
                  Annulla
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AggiungiAppunto;
