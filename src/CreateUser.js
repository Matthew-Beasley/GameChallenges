import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState, emailKeyState } from './RecoilState';
import { useCookies } from 'react-cookie';
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

const StandbyForVerification = () => {
  return (
    <div>
      <h3>Please check your email to verify your account, or spam filter if you don't see it.</h3>
    </div>
  );
};

const CreateUser = () => {
  const headers = useRecoilValue(headerState);
  const [password, setPassword] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [emailKey, setEmailKey] = useRecoilState(emailKeyState);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);


  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, [csrf]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setEmail(response.data[0]);
      });
    }
  }, [token]);

  const checkCredentials = async (event) => {
    event.preventDefault();
    const usr = (await axios.get(`/user?email=${email}`)).data[0];
    if (!usr) {
      if (password && email && firstName && lastName) {
        const err = await axios.post('/user/mail', { password, email, first_name: firstName, last_name: lastName });
        console.log(err)
        setPassword('');
        setEmail('');
        history.push('/verifyuser');
      } else {
        alert('All data fields must be filled out');
      }
    } else if (usr.email) {
      alert('User already exists, try logging in');
    }
  };

  return (
    <div id="createuser-container">
      <div id="create-column">
        <NavBar />
        <form onSubmit={(ev) => checkCredentials(ev)}>
          <div id="createuser-text">
            <p>To create an account enter email and password</p>
            <p>Be sure to use a a valid email as it will be used in billing and order fullfilment</p>
          </div>
          <input className="create-input" type="text" placeholder="First Name" value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
          <input className="create-input" type="text" placeholder="Last Name" value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
          <input className="create-input" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
          <input className="create-input" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <input id="submit" type="submit" value="Submit" />
          <Link to="terms">Terms of Use</Link>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
export {
  StandbyForVerification
};