import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, csrfState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';


const Login = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [userName, setUserName] = useState('');
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, []);

  // need to alert user that credentials are not valid
  const login = async (ev) => {
    ev.preventDefault(ev);
    let creds = undefined;
    try {
      creds = (await axios.get('/auth', { headers: { username: userName, password: password }})).data;
    } catch (err) {
      const placeholder = err;
    }
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setUserName('');
    setPassword('');
    setToken(creds);
  };

  const logout = () => {
    setToken('');
    setUser({});
  };

  return (
    <div id="login-container">
      <div id="login-column">
        <div id="login-text">
          <div>{user.userName ? 'Welcome Back ' + user.userName + '!' : null}</div>
          <h1> Thwart Me Login</h1>
        </div>
        <Link to="/createuser">Create an account</Link>
        <form id="login-form" onSubmit={(ev) => login(ev)}>
          <input id="user-name" type="text" placeholder="User Name" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
          <input id="password" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default Login;