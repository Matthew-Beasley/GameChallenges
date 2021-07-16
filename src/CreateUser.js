import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState, emailKeyState } from './RecoilState';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const CreateUser = () => {
  const headers = useRecoilValue(headerState);
  const [password, setPassword] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [emailKey, setEmailKey] = useRecoilState(emailKeyState);
  const [email, setEmail] = useState('');
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, []);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setEmail(response.data[0]);
      });
    }
  }, [token]);

  const login = async () => {
    const creds = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setToken(creds);
  };

  const checkCredentials = async (event) => {
    event.preventDefault();
    const usr = (await axios.get(`/user?email=${email}`)).data;
    if (!usr.email) {
      const creds = CryptoJS.HmacSHA256(JSON.stringify({ password, email, time: Date.now()}), emailKey).toString(CryptoJS.enc.Hex);
      await axios.post('/user/sendmail', { creds }, headers);
      /*
      await axios.post('/user', { password, email });
      await login();
    } else {
      // throw error user exists (alert?)
      //await login({ email, password });
    }
    setPassword('');
    setEmail('');
    history.push('/shopping');
    */
    }
  };

  return (
    <div id="createuser-container">
      <div id="create-column">
        <form onSubmit={(ev) => checkCredentials(ev)}>
          <div id="createuser-text">
            <p>To create an account enter user name and password</p>
          </div>
          <input className="create-input" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
          <input className="create-input" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default CreateUser;