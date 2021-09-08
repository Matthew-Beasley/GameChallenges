import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, headerState, csrfState, tokenState, emailKeyState } from './RecoilState';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './NavBar';
import crypto from 'browserify-cipher/browser';
import Modal from 'react-modal';
Modal.setAppElement('#root');


const StandbyForVerification = () => {
  return (
    <div>
      <h3>Please check your email to verify your account</h3>
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, [csrf]);

 /* useEffect(() => {
    const token = cookies.token;
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setEmailKey(response.data[0]);
      });
    }
  }, [token]);*/

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const checkCredentials = async (event) => {
    event.preventDefault();
    const usr = (await axios.get(`/user?email=${email}`)).data;
    console.log('usr in create user: ', usr)
    if (!usr.email) {
      await axios.post('/user/mailgun', { password, email, first_name: firstName, last_name: lastName });
      setPassword('');
      setEmail('');
      history.push('/verifyuser');
    } else {
      toggleModal();
    }
  };

  return (
    <div id="createuser-container">
      <NavBar />
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div>My modal dialog.</div>
      </Modal>
      <div id="create-column">
        <form onSubmit={(ev) => checkCredentials(ev)}>
          <div id="createuser-text">
            <p>To create an account enter user name and password</p>
            <p>Be sure to use a a valid email as it will be used in billing and order fullfilment</p>
          </div>
          <input className="create-input" type="text" placeholder="First Name" value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
          <input className="create-input" type="text" placeholder="Last Name" value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
          <input className="create-input" type="email" placeholder="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
          <input className="create-input" type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
export {
  StandbyForVerification
};