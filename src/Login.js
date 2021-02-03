import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState } from './RecoilState';

const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');


  const login = async () => {
    //following passes password open text, encode it here with a jwt key, unencode it on the server with the same key, reencryptit on the server
    const token = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    window.localStorage.setItem('ktm300mxc', token);
    const usr = (await axios.get('/user/token', token)).data;
    setUser(usr);
    console.log(usr);
  };

  const logout = () => {
    window.localStorage.removeItem('ktm300mxc');
  };

  return (
    <div id="login">
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