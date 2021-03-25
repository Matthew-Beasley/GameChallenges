import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Login from './Login';
import { tokenState, userState } from './RecoilState';


const NavBar = () => {
  const [token, setToken] = useRecoilState(tokenState);

  return (
    <div id="navbar">
      <div id="nav-links">
        {token ? <Link to="/gamepage" >Thwart Me</Link> : <div id="thwartme-link-spacer" style={{width: '8rem'}} />}
        <Link to="/about" >About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <Login />
    </div>
  );
};

export default NavBar; 