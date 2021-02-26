import React, { useState, useEffect } from 'react';
import { Link , withRouter } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, navigatorSelector, tokenState } from './RecoilState';
import { useHistory } from 'react-router-dom';


const CreateUser = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [userName, setUserName] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (token) {
      axios.post('/user/token', { token: token }).then(response => {
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
    history.push('/gamesetup');
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