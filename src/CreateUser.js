import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState } from './RecoilState';

const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');

  const URLizeEmail = (mail) => {
    mail = mail.replace(/\./gi, '%2E');
    mail = mail.replace(/@/gi, '%40');
    return mail;
  };

  const login = async () => { //credentials not a prop (got error)
    //following passes password open text, encode it here with a jwt key, unencode it on the server with the same key, reencryptit on the server
    const token = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    window.localStorage.setItem('ktm300mxc', token);
    const usr = (await axios.get('/user/token', token)).data;
    setUser(usr);
  };

  const checkCredentials = async (event) => {
    event.preventDefault();
    const mail = URLizeEmail(email);
    const usr = (await axios.get(`/user?email=${mail}`)).data;
    if (!usr.email) {
      await axios.post('/user', { email, password });
      await login({ email, password });
    } else {
      // throw error user exists (alert?)
      //await login({ email, password });
    }
    setEmail('');
    setPassword('');
    // history.push('/UserView');
  };

  return (
    <div id="create-user">
      <form id="create-user-form" onSubmit={(ev) => checkCredentials(ev)}>
        <div id="create-user-text">
          <p>To create an account enter email and password</p>
        </div>
        <input id="email" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
        <input id="password" type="password" placeholder="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <input id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreateUser;