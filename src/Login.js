import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, headerState, userState } from './RecoilState';
import NavBar from './NavBar';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');


const Login = () => {
  const [password, setPassword] = useState('');
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const headers = useRecoilValue(headerState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const history = useHistory();
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, [csrf]);

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-Token'] = csrf;
  }, [token]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setUser(response.data[0]);
        history.push('/shopping');
      });
    }
  }, [token]);

  // need to alert user that credentials are not valid
  const login = async () => {
    let creds = undefined;
    try {
      creds = (await axios.get('/auth', { headers: { email: email, password: password }})).data;
    } catch (err) {
      openModal();
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Login failed</h2>
        <div>Check your user name and password</div>
        <button onClick={closeModal}>close</button>
      </Modal>
      <img src="../assets/images/right-3.png" />
      <NavBar />
      <div id="login-inputs">
        {!!token && <div id="welcome-user">Welcome {user.email}</div>}
        <input id="user-name" type="text" placeholder="Email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
        <input id="password" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        {!token && <button className="login-submit" onClick={() => login()}>Login</button>}
        {!!token && <button className="login-submit" onClick={() => logout()}>Log Out</button>}
      </div>
      <Link to="terms">Terms of Use</Link>
    </div>
  );
};

export default Login;
