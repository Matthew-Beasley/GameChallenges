import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, headerState, userState } from './RecoilState';


const Login = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const headers = useRecoilValue(headerState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const history = useHistory();

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-Token'] = csrf;
  }, [token]);

  useEffect(() => {
  }, [user]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        console.log('in login ', response.data[0]);
        setUser(response.data[0]);
        history.push('/shopping')
      });
    }
  }, [token]);

  // need to alert user that credentials are not valid
  const login = async () => {
    let creds = undefined;
    try {
      creds = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    } catch (err) {
      const placeholder = err;
    }
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setEmail('');
    setPassword('');
    setToken(creds);
  };

  const logout = () => {
    removeCookie('token');
    setToken('');
    setUser({});
    history.push('/');
  };

  return (
    <div id="login-container" >
      {!!token && <div id="welcome-user">Welcome {user.email}</div>}
      <input id="user-name" type="text" placeholder="Email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
      <input id="password" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
      {!token && <button className="login-submit" onClick={() => login()}>Login</button>}
      {!!token && <button className="login-submit" onClick={() => logout()}>Log Out</button>}
      <Link to="/createuser">Create an account</Link>
    </div>
  );
};

export default Login;