import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

function Home() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [allegati, setAllegati] = useState([]);
  const [latestNotes, setLatestNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token non trovato");
  
        let page = 0; 
        let allNotes = [];
  
        
        while (true) {
          const response = await fetch(`http://localhost:3001/appunti?page=${page}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Errore nella risposta dell'API: ${response.status}`);
          }
  
          const data = await response.json();
          const notes = data.content || [];
  
          if (notes.length === 0) break; 
  
          allNotes = [...allNotes, ...notes]; 
          page++; 
        }
  
       
        const sortedNotes = allNotes
          .sort((a, b) => new Date(b.dataCreazione) - new Date(a.dataCreazione))
          .slice(0, 5);
  
        setLatestNotes(sortedNotes);
      } catch (err) {
        console.error("Errore nel caricamento degli ultimi appunti:", err.message);
      }
    };
  
    fetchLatestNotes();
  }, []);
  
  
  

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setError("Il campo di ricerca non può essere vuoto.");
      return;
    }

    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token non trovato");
        return;
      }

      const response = await fetch(`http://localhost:3001/appunti/titolo/${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        navigate("/NotFound");
      }

      const data = await response.json();
      setResult(data);

      if (data.id) {
        const allegatiResponse = await fetch(`http://localhost:3001/allegati/${data.id}/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (allegatiResponse.ok) {
          const allegatiData = await allegatiResponse.json();
          setAllegati(allegatiData);
        } else {
          setAllegati([]);
        }
      } else {
        setAllegati([]);
      }
    } catch (err) {
      setResult(null);
      setAllegati([]);
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
              placeholder="Cerca appunti..."
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
            <Card className="my-4 mx-auto text-center bg-success text-light" style={{ width: '20rem' }}>
              <Card.Img variant="top" src="https://png.pngtree.com/background/20230614/original/pngtree-an-open-book-sits-on-top-of-several-books-picture-image_3462697.jpg" />
              <Card.Body>
                <Card.Title>Risultato ricerca</Card.Title>
                <Card.Text>
                  <p><strong>Titolo:</strong> {result.titolo}</p>
                  <p><strong>Contenuto:</strong> {result.contenuto}</p>
                  <p><strong>Caricato da:</strong> {result.utente.fullname}</p>
                  <p><strong>Creato il :</strong> {new Date(result.dataCreazione).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</p>
                </Card.Text>

                {allegati.length > 0 && (
                  allegati.map((allegato) => (
                    <Button
                      key={allegato.id}
                      variant="primary"
                      href={allegato.file}
                      target="_blank"
                    >
                      Scarica Allegato {allegato.file}
                    </Button>
                  ))
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      {!result && (
        <Row className="w-100 mt-4">
          <Col>
          <Carousel>
  {latestNotes.map((note) => (
    <Carousel.Item key={note.id}>
       
        <h5 className='text-center'>Appunti Recenti..</h5>
        
      <div className="d-flex justify-content-center">
       
        <Card className="text-center bg-secondary text-light" style={{ width: '18rem',  height: '20rem'}}>
          <Card.Body>
            <Card.Title>{note.titolo}</Card.Title>
            <Card.Text>
              <p><strong>Contenuto:</strong> {note.contenuto?.slice(0, 50)}...</p>
              <p><strong>Caricato da:</strong> {note.utente?.fullname || "Sconosciuto"}</p>
              <p>
                <strong>Creato il:</strong>{" "}
                {new Date(note.dataCreazione).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </Card.Text>
            <Button variant="primary" href={`/appunti/${note.id}`}>
              Vai all'appunto
            </Button>
          </Card.Body>
        </Card>
      </div>
     
    </Carousel.Item>
  ))}
</Carousel>

          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Home;
