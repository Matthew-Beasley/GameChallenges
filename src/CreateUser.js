import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import PlatformSelector from './PlatformSelector';

const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (token) {
      axios.post('/user/token', { token: token }).then(response => {
        setUser(response.data[0]);
      });
    }
  }, [token]);

  const URLizeEmail = (mail) => {
    mail = mail.replace(/\./gi, '%2E');
    mail = mail.replace(/@/gi, '%40');
    return mail;
  };

  const login = async () => {
    const creds = (await axios.get('/auth', { headers: { username: userName, password: password }})).data;
    setToken(creds);
  };

  const checkCredentials = async (event) => {
    event.preventDefault();
    const usr = (await axios.get(`/user?username=${userName}`)).data;
    if (!usr.userName) {
      await axios.post('/user', { userName, password, email});
      await login();
    } else {
      // throw error user exists (alert?)
      //await login({ email, password });
    }
    setUserName('');
    setPassword('');
    setEmail('');
    // history.push('/UserView');
  };

  return (
    <div id="create-user">
      <PlatformSelector />
      <form id="create-user-form" onSubmit={(ev) => checkCredentials(ev)}>
        <div id="create-user-text">
          <p>To create an account enter user name and password</p>
        </div>
        <input className="create-input" type="text" placeholder="User Name" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
        <input className="create-input" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <input className="create-input" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
        <input id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreateUser;