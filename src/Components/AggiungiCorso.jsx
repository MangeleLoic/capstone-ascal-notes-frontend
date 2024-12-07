import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AggiungiCorso() {
  const [formData, setFormData] = useState({
    nome: "",
    codice: "",
    descrizione: "",
    facolta: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.nome || !formData.codice || !formData.descrizione || !formData.facolta) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/corsi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiungere il corso.");
      }

      
      navigate("/admin");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Aggiungi Corso</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Nome</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Codice</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="codice"
                  value={formData.codice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Descrizione</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  name="descrizione"
                  rows="3"
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Facoltà</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="facolta"
                  value={formData.facolta}
                  onChange={handleChange}
                >
                  <option value="">Seleziona facoltà</option>
                  <option value="Farmacia">Farmacia</option>
                  <option value="Informatica">Informatica</option>
                  <option value="Ingegneria Informatica">Ingegneria Informatica</option>
                  <option value="Infermieristica">Infermieristica</option>
                  <option value="Altro">Altro</option>
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
                <a className="btn btn-secondary" href="/admin" role="button">
                  Cancella
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AggiungiCorso;
