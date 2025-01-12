import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

function SingleAppunto() {
  const { noteId } = useParams(); // Prende l'ID dell'appunto dalla URL
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [allegati, setAllegati] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token non trovato");

        // Fetch appunto specifico
        const response = await fetch(`http://localhost:3001/appunti/${noteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore nella risposta dell'API: ${response.status}`);
        }

        const data = await response.json();
        setNote(data);

        // Fetch allegati per l'appunto
        const allegatiResponse = await fetch(`http://localhost:3001/allegati/${noteId}/all`, {
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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNoteDetails();
  }, [noteId]);

  if (error) {
    return <p className="text-danger">Errore: {error}</p>;
  }

  if (!note) {
    return <p>Caricamento...</p>;
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 text-center"
    >
      <Row className="justify-content-center w-75">
        <Col xs={12} md={8} lg={6}>
          <Card className="mb-4 mt-3">
            <Card.Body>
              <Card.Title>{note.titolo}</Card.Title>
              <Card.Img variant="top" src="https://png.pngtree.com/background/20230614/original/pngtree-an-open-book-sits-on-top-of-several-books-picture-image_3462697.jpg" />
              <Card.Text className='mt-4'>
              <p><strong>Contenuto:</strong> {note.contenuto}</p>
                <div className="d-flex-column align-items-center mb-3">
                
                  <img
                    src={note.utente.profileImage || 'default-profile.jpg'} 
                    alt="Profilo"
                    className="rounded-circle"
                    width="80"
                    height="80"
                  /> <br />
                  
                  <p className="ms-3"><strong>Creato da:</strong> {note.utente.fullname}</p>
                </div>
               
                <p><strong>Data creazione:</strong> {new Date(note.dataCreazione).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
              </Card.Text>
  
              {allegati.length > 0 && (
                <div>
                  <h5>Allegati:</h5>
                  {allegati.map((allegato) => (
                    <Button
                      key={allegato.id}
                      variant="primary"
                      href={allegato.file}
                      target="_blank"
                    >
                      Scarica {allegato.file}
                    </Button>
                  ))}
                </div>
              )}
  
              {/* Implemento i commenti in seguito */} 
            </Card.Body>
          </Card>
  
          <Button variant="secondary" onClick={() => navigate("/Home")}>
            Torna alla home
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleAppunto;
