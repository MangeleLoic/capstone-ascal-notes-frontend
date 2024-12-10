import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModificaAppunti() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titolo: "",
    contenuto: "",
    allegato: null,  
  });
  const [error, setError] = useState("");
  const [allegato, setAllegato] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppunto = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token di autenticazione non trovato.");
        }

        const response = await fetch(`http://localhost:3001/appunti/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'appunto.");
        }

        const data = await response.json();
        setFormData({
          titolo: data.titolo || "",
          contenuto: data.contenuto || "",
          allegato: null,  
        });
        setAllegato(data.allegato); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppunto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      allegato: e.target.files[0],  
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titolo || !formData.contenuto) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

     
      const formDataToSend = new FormData();
      formDataToSend.append("titolo", formData.titolo);
      formDataToSend.append("contenuto", formData.contenuto);

      if (formData.allegato) {
        formDataToSend.append("allegato", formData.allegato);  
      }

      const response = await fetch(`http://localhost:3001/appunti/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Errore nella modifica dell'appunto.");
      }

      navigate("/appunti");  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-4 ">
      <div className="row">
        <div className="col-md-8 mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Modifica Appunto</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">ID</label>
              <div className="col-sm-8">
                <input readOnly className="form-control-plaintext" value={id} />
              </div>
            </div>

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
              <label className="col-sm-4 col-form-label">Allegato</label>
              <div className="col-sm-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                {allegato && (
                  <div className="mt-2">
                    <a href={allegato.path} target="_blank" rel="noopener noreferrer">
                      Visualizza Allegato Esistente
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-flex">
                <button type="submit" className="btn btn-primary">
                  Modifica
                </button>
              </div>
              <div className="col-sm-4 d-flex">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/appunti")}
                >
                  Annulla
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModificaAppunti;
