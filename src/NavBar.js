import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';

const NavBar = () => {

  return (
    <div id="navbar">
      <div id="nav-links">
        <Link to="/" >Thwart Me</Link>
        <Link to="/about" >About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </div>
  );
};

export default NavBar; 