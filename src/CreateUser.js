import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
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
  const [notify, setNotify] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      axios.post('/user/token', { token: token }).then(response => {
        setUser(response.data[0]);
      });
    }
  }, [token]);

  const toggleCheckbox = () => {
    if (notify) {
      setNotify(false);
    } else {
      setNotify(true);
    }
  };

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
      await axios.post('/user', { userName, password, email, notify });
      await login();
    } else {
      // throw error user exists (alert?)
      //await login({ email, password });
    }
    setNotify(false);
    setUserName('');
    setPassword('');
    setEmail('');
    history.push('/gamesetup');
  };

  return (
    <div id="createuser-container">
      <div id="create-column">
        <form onSubmit={(ev) => checkCredentials(ev)}>
          <div id="createuser-text">
            <p>To create an account enter user name and password</p>
          </div>
          <input className="create-input" type="text" placeholder="User Name" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
          <input className="create-input" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <input className="create-input" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
          <div id="create-email">
            <input id="create-checkbox" type="checkbox" value={notify} onChange={() => toggleCheckbox()}></input>
            <p id="check-text">Do you want game news in your inbox?</p>
          </div>
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default CreateUser;