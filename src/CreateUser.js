import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState, emailKeyState } from './RecoilState';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'browserify-cipher/browser';


const StandbyForVerification = () => {
  return (
    <div>
      <h3>Please check your email to verify your account</h3>
    </div>
  );
};

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
  }, [csrf]);

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
      await axios.post('/user/mailgun', { password, email });
      setPassword('');
      setEmail('');
      history.push('/verifyuser');
    } else {
      history.push('/shopping');
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
export {
  StandbyForVerification
};