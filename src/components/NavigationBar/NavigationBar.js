import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import './NavigationBar.css'

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="NavigationBar">
      <Navbar expand="md">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink className="navLink" href="/">Nowa wycena</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="navLink" href="/allCalculations">Wszystkie wyceny</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      </div>
  );
}

export default NavigationBar;