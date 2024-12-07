import { Button, Container, Card, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function FormRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);

        setSuccess(true);
        setFormData({ username: "", email: "", password: "", fullname: "" });

        alert("Registrazione avvenuta con successo! Sei connesso.");

        navigate("/Home");
        
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Errore durante la registrazione.");
      }
    } catch (error) {
      setError("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center pb-3 vh-100">
      <Card className="p-4 shadow cardSign mb-3">
        <Card.Title className="mb-2 fs-2 text-center">Registrati</Card.Title>
        <Card.Text className="text-center">
          Inizia subito a utilizzare Ascal Notes!
        </Card.Text>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">Registrazione completata con successo!</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              name="username"
              placeholder="Nome utente"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFullname">
            <Form.Control
              type="text"
              name="fullname"
              placeholder="Nome completo"
              required
              value={formData.fullname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="btn-lg w-100 rounded-pill"
          >
            Registrati
          </Button>
        </Form>
        
        <Card.Text className="text-center mt-3"> 
          Hai già un account?{" "}
          <Link to="/login" className="text-primary hover-underline">
            Accedi ora
          </Link>
        </Card.Text>
      </Card>
    </Container>
  );
};

export default FormRegister;
