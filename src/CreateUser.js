import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState } from './RecoilState';
import { useCookies } from 'react-cookie';


const CreateUser = () => {
  const headers = useRecoilValue(headerState);
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [notify, setNotify] = useState(false);
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    console.log('csrf in useEffect ', csrf)
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
    console.log('creds in login ', creds)
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setToken(creds);
  };

  const checkCredentials = async (event) => {
    event.preventDefault();
    const usr = (await axios.get(`/user?username=${userName}`)).data;
    console.log('user in checkCredentials ', user)
    if (!usr.userName) {
      console.log('axios default headers ', axios.defaults.headers)
      await axios.post('/user', { userName, password, email, notify });
      console.log('posted user data')
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