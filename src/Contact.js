import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import NavBar from './NavBar';
import { useRecoilState } from 'recoil';
import { headerState } from './RecoilState';


const Contact = () => {
  const [headers, setHeaders] = useRecoilState(headerState);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [cookies, setCookie] = useCookies(['CSRF_token']);
  const history = useHistory();

  useEffect(() => {
    axios.defaults.headers.common['X-CSRF-Token'] = cookies.CSRF_token;
  }, []);

  const sendEmail = async (ev) => {
    ev.preventDefault();
    const response = await axios.post('/user/contactus', { email, message });
    console.log('sendmail response: ', response)
    // do error handling here
    history.push('/');
  };

  return (
    <div id="contactpage">
      <NavBar />
      <form id="contact-form" onSubmit={(ev) => sendEmail(ev)}>
        <input type="email" id="contact-email" placeholder="email@example.com" onChange={(ev) => setEmail(ev.target.value)} />
        <textarea type="text" id="contact-text" placeholder="message" onChange={(ev) => setMessage(ev.target.value)} />
        <input type="submit" id="contact-submit" value="Submit" />
      </form>
    </div>
  );
};

export default Contact;