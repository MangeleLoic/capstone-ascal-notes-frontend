import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Alert, Image, Spinner } from "react-bootstrap";

function ProfiloUtente() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullname: "",
    profileImage: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
  console.log("Token:", accessToken);
    fetch("http://localhost:3001/utenti/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero del profilo");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Errore nel recupero del profilo");
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3001/utenti/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: userData.username,
          fullname: userData.fullname,
          email: userData.email,
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUserData(updatedData);
        setSuccess("Profilo aggiornato con successo!");
        setEditMode(false);
      } else {
        setError("Errore durante l'aggiornamento del profilo.");
      }
    } catch {
      setError("Si è verificato un errore.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUserData({ ...userData, profileImage: URL.createObjectURL(e.target.files[0]) });
  };

  const handleUploadImage = async () => {
    if (!file) {
      setError("Nessun file selezionato.");
      return;
    }

    const formData = new FormData();
    formData.append("img", file);

    try {
      const res = await fetch(`http://localhost:3001/utenti/${userData.id}/img`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updatedImageUrl = await res.text();
        setUserData({ ...userData, profileImage: updatedImageUrl });
        setSuccess("Immagine del profilo aggiornata con successo!");
      } else {
        setError("Errore durante il caricamento dell'immagine.");
      }
    } catch {
      setError("Si è verificato un errore durante il caricamento.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento profilo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <Card.Title>Profilo Utente</Card.Title>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="text-center mb-4">
          <Image
            src={userData.profileImage || "https://via.placeholder.com/150"}
            roundedCircle
            width={150}
            height={150}
          />
        </div>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              type="text"
              value={userData.fullname}
              onChange={(e) =>
                setUserData({ ...userData, fullname: e.target.value })
              }
              disabled={!editMode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
  <Form.Label>Email</Form.Label>
  <Form.Control
    type="email"
    value={userData.email}
    onChange={(e) =>
      setUserData({ ...userData, email: e.target.value })
    }
    disabled={!editMode}
  />
</Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nome Utente</Form.Label>
            <Form.Control
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              disabled={!editMode}
            />
          </Form.Group>
          {editMode && (
            <Form.Group className="mb-3">
              <Form.Label>Carica una nuova immagine</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              <Button variant="info" className="mt-2" onClick={handleUploadImage}>
                Carica Immagine
              </Button>
            </Form.Group>
          )}
          {editMode && (
            <Button variant="primary" type="submit">
              Salva Modifiche
            </Button>
          )}
        </Form>
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Annulla" : "Modifica Profilo"}
        </Button>
      </Card>
    </Container>
  );
}

export default ProfiloUtente;
