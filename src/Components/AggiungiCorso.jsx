import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AggiungiCorso() {
  const [formData, setFormData] = useState({
    nome: "",
    codice: "",
    descrizione: "",
    facolta: "",
  });
  const [error, setError] = useState(null);
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
    <Container className="my-4">
      <Row className="justify-content-center">
      <Col md={8} className="rounded border p-4">
          <h2 className="text-center mb-5">Aggiungi Corso</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

             <Row className=" mb-3">
              <Form.Label column sm={4}>
                Nome
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Inserisci il nome del corso"
                />
              </Col>
           </Row>

             <Row className=" mb-3">
              <Form.Label column sm={4}>
                Codice
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                 as="textarea"
                  name="codice"
                  value={formData.codice}
                  onChange={handleChange}
                  placeholder="Inserisci il codice del corso"
                />
              </Col>
           </Row>

             <Row className=" mb-3">
              <Form.Label column sm={4}>
                Descrizione
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  name="descrizione"
                  rows={3}
                  value={formData.descrizione}
                  onChange={handleChange}
                  placeholder="Inserisci una descrizione del corso"
                />
              </Col>
           </Row>

             <Row className=" mb-3">
              <Form.Label column sm={4}>
                Facoltà
              </Form.Label>
              <Col sm={8}>
                <Form.Select
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
                </Form.Select>
              </Col>
           </Row>

            <Row className="align-items-center" >
              <Col sm={4} className="offset-sm-4 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Aggiungi
                </button>
              </Col>
              <Col sm={4} className=" d-flex justify-content-center">
                <a className="btn btn-secondary" href="/admin" role="button">
                  Cancella
                </a>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default AggiungiCorso;
