import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { csrfState, tokenState, emailKeyState, userState , headerState } from './RecoilState';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import axios from 'axios';
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

const LandingPage = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [recoilUserr, setRecoilUser] = useRecoilState(userState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['token']);
  const [emailKey, setEmailKey] = useRecoilState(emailKeyState);
  const [decryptedCreds, setDecryptedCreds] = useState('');
  const headers = useRecoilValue(headerState);

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

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

  const login = async (email, password) => {
    const creds = (await axios.get('/auth', { headers: { email, password }})).data;
    setCookie('token', creds, { path: '/', maxAge: 43200 });
    setToken(creds);
    history.push('/shopping');
  };

  const createFoxyCustomer = async (user) => {
    const token = (await axios.get('/foxy/apitoken')).data;
    const {email, password, first_name, last_name } = user;
    const authorization = { 
      'FOXY-API-VERSION': '1', 
      'Authorization': token
    };
    let customerId;
    try {
      customerId = (await axios.post('/foxy/createcustomer', { email, password, first_name, last_name, token }, authorization)).data;
    } catch (error) {
      console.log('error in createFoxyCustomer: ', error);
      return 'user exists in foxy';
    }
    return customerId;
  };

  const checkCredentials = async ({ email, password, first_name, last_name }) => {
    const usr = (await axios.get(`/user?email=${email}`)).data;
    if (!usr.email) {
      if (email && password && first_name && last_name) {
        let foxy_id = await createFoxyCustomer({ email, password, first_name, last_name });
        if (foxy_id === 'Request failed with status code 409') {
          openModal();
          return;
        }
        await axios.post('/user', { password, email, first_name, last_name, foxy_id });
      } else {
        alert('Missing data in creating user. Try creating the user again.');
        return;
      }
    } else {
      setRecoilUser(usr);
      login(email, password);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-Token'] = csrf;
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, [csrf]);

  useEffect(() => { 
    const currentURL = window.location.href;
    if (currentURL.includes('nonce') && csrf !== '') {
      const encryptedCreds = currentURL.slice(currentURL.indexOf('nonce=') + 6, currentURL.length);
      const bytes  = CryptoJS.AES.decrypt(encryptedCreds, emailKey);
      const decryptedCreds = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      checkCredentials(decryptedCreds);
    } else {
      const token = cookies.token;
      if (token) {
        axios.post('/user/token', { token: token }, headers).then(response => {
          setRecoilUser(response.data[0]);
         // history.push('/shopping');
        });
      }
    }
  }, [csrf]);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Data error on server</h2>
        <div>This is most likely a duplicate user. Try just signing in with this email, or try a different email or use the contact us link for help.</div>
        <button onClick={closeModal}>close</button>
      </Modal>
      <div id="landingpage">
        <NavBar />
        <div id="landingpage-wrapper">
          <div id="landingpage-image">
            <div id="signup" >
              <div id="bubble">
                <img src="../assets/images/SignupNow-small.png" />
              </div>
              <div id="signup-text" onClick={() => history.push('/login')}>
                <div>Sign Up Now!</div>
                <div>Play For Free!</div>
              </div>
            </div>
            <img src="../assets/images/GameOn-small.png" />
            {/*<div id="table"></div>*/}
          </div>
          <div id="landingpage-text">
            <div id="thwartme-header">Thwart Me!</div>
            <div className="landingpage-header" >Challenge your friends to ridiculous stunts in games you already have!</div>
            <div className="landingpage-header" >Never play the objective again:</div>
            <ol>
              <li>Gather your gaming friends.</li>
              <li>Pull out all those games that you loved but have played out.</li>
              <li>Start a round of “Thwart Me!”</li>
            </ol>
            <p>
          You’ll find new ways to love your games all over again, as you attempt crazy 
          challenges that have nothing to do with how the game was meant to be played.  
          Whether it’s an unconventional race or a treasure hunt, you’ll laugh your 
          way through<br/> an epic fail or<br/> ultimate victory.
            </p>
          </div>
        </div>
        <div id="landingpage-phone">
          <img src="../assets/images/right-3.png" />
          <div className="phone-bubble top-bubble" onClick={() => history.push('/login')}>
            <div className="signup-text">Sign Up Now!</div> 
            <div className="signup-text">Play For Free!</div>
          </div>
          <div className="phone-bubble">
            <div id="thwartme-header">Thwart Me!</div>
            <div className="landingpage-header" >Challenge your friends to ridiculous stunts in games you already have!</div>
            <div className="landingpage-header" >Never play the objective again:</div>
            <ol>
              <li>Gather your gaming friends.</li>
              <li>Pull out all those games that you loved but have played out.</li>
              <li>Start a round of “Thwart Me!”</li>
            </ol>
            <p>
            You’ll find new ways to love your games all over again, as you attempt crazy 
            challenges that have nothing to do with how the game was meant to be played.  
            Whether it’s an unconventional race or a treasure hunt, you’ll laugh your 
            way through an epic fail or<br/> ultimate victory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;