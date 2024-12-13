import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AggiungiAppunto() {
  const [formData, setFormData] = useState({
    titolo: "",
    contenuto: "",
    utenteId: "",
    corsoId: "",
  });
  const [corsi, setCorsi] = useState([]);
  const [utente, setUtente] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  
  useEffect(() => {
    const fetchCorsi = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/corsi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dei corsi.");
        }

        const data = await response.json();
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
        if (!token) {
          throw new Error("Token mancante. Effettua di nuovo l'accesso.");
        }
        const response = await fetch("http://localhost:3001/utenti/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'utente.");
        }

        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          utenteId: data.id, 
        }));
      } catch (error) {
        setError(error.message);
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
        body: JSON.stringify({ ...formData, utente }), 
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
    <Container className=" my-4">
      <Row className="justify-content-center" >
      <Col md={8} className="rounded border p-4">
          <h2 className="text-center mb-5">Aggiungi Appunto</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <Row className=" mb-3">
            <Form.Label column sm={4}>
                Titolo
              </Form.Label>
              <Col sm={8}>
              <Form.Control
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className=" mb-3">
            <Form.Label column sm={4}>
                Contenuto
              </Form.Label>
              <Col sm={8}>
              <Form.Control
                  as="textarea"
                  name="contenuto"
                  rows={3}
                  value={formData.contenuto}
                  onChange={handleChange}
                  placeholder="Scrivi il contenuto"
                />
              </Col>
            </Row>

            <Row className=" mb-3">
            <Form.Label column sm={4}>
                Corso
              </Form.Label>
              <Col sm={8}>
              <Form.Select
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
                </Form.Select>
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col sm={4} className="offset-sm-4  d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Aggiungi
                </button>
              </Col>
              <Col sm={4} className=" d-flex justify-content-center">
                <a className="btn btn-secondary" href="/appunti" role="button">
                  Annulla
                </a>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default AggiungiAppunto;
