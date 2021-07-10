import React, {useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, headerState } from './RecoilState';
import LandingPage from './LandingPage';
import CreateUser from './CreateUser';
import Login from './Login';
import GameContainer from './GameContainer';
import Contact from './Contact';
import About from './About';
import Foxy from './Foxy';
import ReadMore from './ReadMore';
import Credits from './Credits';

const App = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);

  useEffect(() => {
    setToken(cookies.token);
    setCsrf(cookies.CSRF_token);
  }, []);

  return (
    <div id="app-container">
      <Route exact path="/" component={LandingPage} />
      <Route path="/gamepage" component={GameContainer} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path='/readmore' component={ReadMore} />
      <Route path="/login" component={Login} />
      <Route path="/createuser" component={CreateUser} />
      <Route path='/shopping' component={Foxy} />
      <Route path='/credits' component={Credits} />
    </div>
  );
};

export default App;