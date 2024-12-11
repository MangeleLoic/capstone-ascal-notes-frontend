import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function Home() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault(); 
    if (!search.trim()) {
      setError("Il campo di ricerca non può essere vuoto.");
      return;
    }

    setError(null); 

    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`http://localhost:3001/appunti/titolo/${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nessun risultato trovato o errore nel server.");
      }

      const data = await response.json();
      setResult(data); 
    } catch (err) {
      setResult(null); 
      setError(err.message);
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-light border-top border-1 border-secondary home-container"
    >
      <Row className="text-center mb-4">
        <Col>
          <h1 className="display-4">Benvenuto nella piattaforma Ascal Notes</h1>
          <h6 className="fs-4">Cerca e consulta gli appunti di chi segue i tuoi stessi corsi.</h6>
          <h6 className="fs-4">Oppure carica degli appunti per aiutare altri che seguono i tuoi stessi corsi.</h6>
        </Col>
      </Row>
      <Row className="justify-content-center w-100">
        <Col xs={10} md={8} lg={6}>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Cerca appunti, corsi o utenti..."
              className="form-control-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="primary" className="ms-2 btn-lg">
              Cerca
            </Button>
          </Form>
          {error && <p className="text-danger mt-3">{error}</p>}
          {result && (
            <Card className="mt-4 p-3 bg-success rounded text-light" >
            <Card.Body>
              <Card.Title>Risultato ricerca</Card.Title>
              <Card.Text>
              <p><strong>Titolo:</strong> {result.titolo}</p>
              <p><strong>Contenuto:</strong> {result.contenuto}</p>
              </Card.Text>
              
            </Card.Body>
          </Card>

            
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
