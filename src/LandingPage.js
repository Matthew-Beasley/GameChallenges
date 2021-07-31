import React, { useEffect, useState } from 'react';
import { Route, Link, useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState, emailKeyState } from './RecoilState';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import NavBar from './NavBar';


const LandingPage = () => {
  const headers = useRecoilValue(headerState);
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);
  const [emailKey, setEmailKey] = useRecoilState(emailKeyState);


  const login = async (email, password) => {
    const creds = (await axios.get('/auth', { headers: { email, password }})).data;
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setToken(creds);
  };

  const createFoxyCustomer = async (user) => {
    // refresh token
    const token = (await axios.get('/foxy/apitoken')).data;
    console.log('refresh token: ', token)
    //post to foxy createuser route with user data 
    const {email, password, first_name, last_name } = user;
    console.log('headers in creatFoxyCustomer: ', headers)
    const customer = (await axios.post('foxy/createcustomer', { email, password, first_name, last_name, token }, headers)).data;
    console.log('customer in createFoxyCustomer: ', customer)
    return customer;
  };

  const checkCredentials = async (email, password, first_name, last_name) => {
    const usr = (await axios.get(`/user?email=${email}`)).data;
    if (!usr.email) {
      await axios.post('/user', { password, email, first_name, last_name });
      const customer = createFoxyCustomer(usr);
      if (!customer) {
        throw new Error('foxy customer not created');
      }
      login(email, password);
    } else {
      // throw error user exists (alert?)
      //await login({ email, password });
    }
    history.push('/shopping');
  };

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-Token'] = csrf;
  }, [csrf]);

  useEffect(() => { 
    const currentURL = window.location.href;
    const encryptedCreds = currentURL.slice(currentURL.indexOf('nonce=') + 6, currentURL.length);
    if (currentURL.includes('nonce') && csrf !== '') {
      const bytes  = CryptoJS.AES.decrypt(encryptedCreds, emailKey);
      const decryptedCreds = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { email, password, first_name, last_name } = decryptedCreds;
      checkCredentials(email, password, first_name, last_name);
    }
  }, [csrf]);

  return (
    <div id="landingpage">
      <NavBar />
      <div id="landingpage-wrapper">
        <div id="landingpage-image">
          <div id="signup" >
            <div id="bubble">
              <img src="../assets/images/SignupNow-small.png" />
            </div>
            <div id="signup-text" onClick={() => history.push('/login')}>
              <div>Sign Up Now!</div>
              <div>Play For Free!</div>
            </div>
          </div>
          <img src="../assets/images/GameOn-small.png" />
          {/*<div id="table"></div>*/}
        </div>
        <div id="landingpage-text">
          <div id="thwartme-header">Thwart Me!</div>
          <div className="landingpage-header" >Challenge your friends to ridiculous stunts in games you already have!</div>
          <div className="landingpage-header" >Never play the objective again:</div>
          <ol>
            <li>Gather your gaming friends.</li>
            <li>Pull out all those games that you loved but have played out.</li>
            <li>Start a round of “Thwart Me!”</li>
          </ol>
          <p>
          You’ll find new ways to love your games all over again, as you attempt crazy 
          challenges that have nothing to do with how the game was meant to be played.  
          Whether it’s an unconventional race or a treasure hunt, you’ll laugh your 
          way through an epic fail or<br/> ultimate victory.
          </p>
          <button onClick={() => history.push('/readmore')}>Read More</button>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;