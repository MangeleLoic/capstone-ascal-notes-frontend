import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Home() {
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
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Cerca appunti, corsi o utenti..."
              className="form-control-lg"
            />
            <Button variant="primary" className="ms-2 btn-lg">
              Cerca
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
