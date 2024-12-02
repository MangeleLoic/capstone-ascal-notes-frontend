import { Button, Container, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, password };

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Login avvenuto con successo!");
        const { token } = await response.json();
        localStorage.setItem("token", token); 

        navigate("/Home");
         
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.log("Errore:", error);
      alert("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center pb-3 vh-100">
      <Card className="p-4 shadow cardSign mb-3">
        <Card.Title className="mb-4 fs-2">Accedi</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Inserisci il nome utente"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Inserisci la password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              type="submit"
              className="btn-lg w-100 rounded-pill"
            >
              Accedi
            </Button>
            <div className="d-flex align-items-center mt-3">
              <hr className="flex-grow-1" />
              <span className="mx-3 text-secondary">oppure</span>
              <hr className="flex-grow-1" />
            </div>
          </div>
        </Form>
        <Button
          variant="light"
          className="btn-lg w-100 rounded-pill border-3 border bg-white mt-3"
          onClick={() => alert("Autenticazione tramite Google non ancora implementata!")}
        >
          <img
            className="me-2 mb-1"
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            width={25}
            alt=""
          />
          Continua con Google
        </Button>
        <p className="mt-3 text-center">
          Non hai un account?{" "}
          <Link to="/register" className="text-primary hover-underline">
            Registrati ora
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default FormLogin;
