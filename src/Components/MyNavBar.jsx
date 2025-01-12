import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavbar() {
  return (
    <Navbar bg="secondary" variant="dark" expand="lg" className="fixed-top">
      <Navbar.Brand className='mx-3'>
        <img src="/library_icon.webp" alt="..." width="40" className='me-2' />
        Ascal Notes
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/Home">Home</Nav.Link>
          <NavDropdown title="Library" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/appunti">
              Appunti
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/corsi">
              Corsi
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
        </Nav>
        <Nav className="ms-auto mx-3">
          <NavDropdown title="My Space" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/Profilo">
              Profilo
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/login">
              Accedi
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavbar;
