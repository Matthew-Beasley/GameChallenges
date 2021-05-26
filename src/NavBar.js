import React from 'react';
import { Route, Link, history } from 'react-router-dom';

const NavBar = () => {
  return (
    <div id="navbar">
      <div className="nav-links">
        <Link to="/" >Thwart Me</Link>
        <Link to="/about" >About Us</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/shopping">Get Decks</Link>
      </div>
      <div className="nav-links">
        <Link to="/login">Sign in</Link>
        <Link to="/createuser">Create Account</Link>
      </div>
    </div>
  );
};

export default NavBar; 