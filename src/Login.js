import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';

const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (token) {
      console.log('token in useEffect ', token)
      axios.post('/user/token', { token: token }).then(response => {
        console.log('user after post to user/token in useEffect ', user)
        setUser(response.data[0]);
      });
    }
  }, [token]);

  const login = async (ev) => {
    ev.preventDefault();
    const creds = (await axios.get('/auth', { headers: { username: userName, password: password }})).data;
    setToken(creds);
    setUserName('');
    setPassword('');
  };

  const logout = () => {
    setToken('');
    setUser({});
  };

  return (
    <div id="login-container">
      <div id="login-column">
        <div id="login-text">
          <h1> THWART ME</h1>
        </div>
        <form id="login-form" onSubmit={(ev) => login(ev)}>
          <input id="user-name" type="text" placeholder="User Name" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
          <input id="password" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <div id="create-container">
            <Link to="/createUser">Create User</Link>
          </div>
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default CreateUser;