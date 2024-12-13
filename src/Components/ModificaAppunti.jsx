import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function ModificaAppunti() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titolo: "",
    contenuto: "",
    utenteId: "",  
    corsoId: "",  
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
            
            Authorization: `Bearer ${token}`,
          },

          
        });


        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'appunto.");
        }

        const data = await response.json();
        console.log(data);
        setFormData({
          titolo: data.titolo || "",
          contenuto: data.contenuto || "",
          utenteId: data.utente.id || "",  
        corsoId: data.corso.id || "",   
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
    setError("");
  
    if (!formData.titolo || !formData.contenuto) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token di autenticazione non trovato.");
      }
  
      
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.allegato);
      formDataToSend.append("appuntoId", id);
  
      const uploadResponse = await fetch("http://localhost:3001/allegati/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!uploadResponse.ok) {
        throw new Error("Errore durante il caricamento dell'allegato.");
      }
  
      const uploadedFileData = await uploadResponse.json(); 
      
      const appuntoUpdateData = {
        titolo: formData.titolo,
        contenuto: formData.contenuto,
        utenteId: formData.utenteId,  
      corsoId: formData.corsoId,   
  allegati: uploadedFileData ? [uploadedFileData.id] : allegato ? [allegato.id] : [],
      };
  
      const response = await fetch(`http://localhost:3001/appunti/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appuntoUpdateData),
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
    <Container className="my-4">
      <Row>
        <Col md={8} className="mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Modifica Appunto</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">ID</label>
              <Col sm={8}>
                <input
                  readOnly
                  className="form-control-plaintext"
                  value={id}
                />
              </Col>
            </Row>

            <Row className="mb-3">
    <label className="col-sm-4 col-form-label">Utente</label>
    <Col sm={8}>
      <input
        readOnly
        className="form-control-plaintext"
        value={formData.utenteId}
      />
    </Col>
  </Row>

  <Row className="mb-3">
    <label className="col-sm-4 col-form-label">Corso</label>
    <Col sm={8}>
      <input
        readOnly
        className="form-control-plaintext"
        value={formData.corsoId}
      />
    </Col>
  </Row>

            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">Titolo</label>
              <Col sm={8}>
                <input
                  className="form-control"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">Contenuto</label>
              <Col sm={8}>
                <textarea
                  className="form-control"
                  name="contenuto"
                  rows="3"
                  value={formData.contenuto}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">Allegato</label>
              <Col sm={8}>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                {allegato && (
                  <div className="mt-2">
                    <a
                      href={allegato.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visualizza Allegato Esistente
                    </a>
                  </div>
                )}
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col sm={4} className="offset-sm-4 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Modifica
                </button>
              </Col>
              <Col sm={4} className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/appunti")}
                >
                  Annulla
                </button>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default ModificaAppunti;