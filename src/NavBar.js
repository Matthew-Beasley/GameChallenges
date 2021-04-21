import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Login from './Login';
import { tokenState, userState } from './RecoilState';


const NavBar = () => {
  const [token, setToken] = useRecoilState(tokenState);

  return (
    <div id="navbar">
      <div className="nav-links">
        <Link to="/landingpage" >Thwart Me</Link>
        <Link to="/about" >About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <div className="nav-links">
        <Link to="/login">Sign in</Link>
        <Link to="/createuser">Create Account</Link>
      </div>
    </div>
  );
};

export default NavBar; 