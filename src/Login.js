import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';

const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);


  useEffect(() => {
    if (token) {
      axios.post('/user/token', { token: token }).then(response => {
        setUser(response.data[0]);
      });
    }
  }, [token]);

  const login = async (ev) => {
    ev.preventDefault();
    const creds = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    setToken(creds);
    setEmail('');
    setPassword('');
  };

  const logout = () => {
    setToken('');
    setUser({});
  };

  return (
    <div id="login">
      <div>{user.email}</div>
      <form id="login-form" onSubmit={(ev) => login(ev)}>
        <div id="login-text">
          <p>Login</p>
        </div>
        <input id="email" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
        <input id="password" type="password" placeholder="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <input id="submit" type="submit" value="Submit" />
        <input id="logout" type="button" value="logout" onClick={() => logout()} />
      </form>
    </div>
  );
};

export default CreateUser;