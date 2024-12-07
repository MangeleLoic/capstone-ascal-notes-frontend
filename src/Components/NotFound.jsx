import React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()

    return (
      <Container>
        <Row className="vh-100 d-flex flex-column justify-content-center align-items-center text-dark border-top border-1 border-secondary">
          <Col xs={12} md={6}>
          <img src="https://cdn-icons-png.flaticon.com/512/7010/7010170.png"  alt="" width="120" className="mb-4 "   />
            <h2>404 - Not found</h2>
            <p>
              Ci dispiace, ma la pagina che stavi cercando non può essere trovata.
            </p>
            <Button className="text-center "
              variant="success"
              onClick={() => {
                navigate('/Home') 
              }}
            >
              TORNA IN HOMEPAGE
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
  
  export default NotFound

