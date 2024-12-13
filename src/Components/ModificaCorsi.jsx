import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function ModificaCorso() {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    nome: "",
    codice: "",
    descrizione: "",
    facolta: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  useEffect(() => {
    console.log("Recuperando il corso con ID:", id);
    const fetchCorso = async () => {
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          throw new Error("Token di autenticazione non trovato.");
        }
  
        const response = await fetch(`http://localhost:3001/corsi/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati del corso.");
        }
  
        const data = await response.json();
        setFormData({
          nome: data.nome || "",
          codice: data.codice || "",
          descrizione: data.descrizione || "",
          facolta: data.facolta || "",
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchCorso();
  }, [id]);
  
  

  
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
      const response = await fetch(`http://localhost:3001/corsi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Errore nella modifica del corso.");
      }

      
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className=" my-4">
      <Row>
        <Col md={8} className=" mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Modifica Corso</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">ID</label>
              <Col sm={8}>
                <input
                  readOnly
                  className="form-control-plaintext"
                  value={id}
                />
              </Col>
            </div>

            <Row className=" mb-3">
              <label className="col-sm-4 col-form-label">Nome</label>
              <Col sm={8}>
                <input
                  className="form-control"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className=" mb-3">
              <label className="col-sm-4 col-form-label">Codice</label>
              <Col sm={8} >
                <input
                  className="form-control"
                  name="codice"
                  value={formData.codice}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">Descrizione</label>
              <Col sm={8} >
                <textarea
                  className="form-control"
                  name="descrizione"
                  rows="3"
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <label className="col-sm-4 col-form-label">Facoltà</label>
              <Col sm={8} >
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
              </Col>
            </Row>

            <Row className="align-items-center" >
            <Col sm={4} className="offset-sm-4  d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Modifica
                </button>
              </Col>
              <Col sm={4} className=" d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin")}
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

export default ModificaCorso;
