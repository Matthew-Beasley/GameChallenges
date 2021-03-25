import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, csrfState, tokenState, headerState } from './RecoilState';
import { useCookies } from 'react-cookie';


const Login = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [userName, setUserName] = useState('');
  const headers = useRecoilValue(headerState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, []);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setUser(response.data[0]);
      });
    }
  }, [token]);

  // need to alert user that credentials are not valid
  const login = async (ev) => {
    let creds = undefined;
    try {
      // TO DO: Check to make sure csrf headers are getting sent here
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
    removeCookie('token');
    setToken('');
    setUser({});
  };

  return (
    <div id="login-container" >
      {!!token && <div id="welcome-user">Welcome {user.userName}</div>}
      <input id="user-name" type="text" placeholder="User Name" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
      <input id="password" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
      {!token && <button className="login-submit" onClick={() => login()}>Login</button>}
      {!!token && <button className="login-submit" onClick={() => logout()}>Log Out</button>}
      <Link to="/createuser">Create an account</Link>
    </div>
  );
};

export default Login;