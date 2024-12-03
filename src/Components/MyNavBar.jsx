import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavbar (){
    return (
        <Navbar bg="secondary" variant="dark" expand="lg">
          <Navbar.Brand className='mx-3' >Ascal Notes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/Home">Home</Nav.Link>
          <Nav.Link as={Link} to="/Profilo">Il mio Profilo</Nav.Link>
          <Nav.Link>My Space</Nav.Link>
          <NavDropdown title="Library" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/1">Appunti</NavDropdown.Item>
            <NavDropdown.Item href="#action/2">Corsi</NavDropdown.Item>
            
          </NavDropdown>
        </Nav>
        <Nav className="ms-auto mx-3">
          <Nav.Link as={Link} to="/login">Accedi</Nav.Link>
        </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
        }
export default MyNavbar