import React, {useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, headerState } from './RecoilState';
import LandingPage from './LandingPage';
import Login from './Login';
import GameContainer from './GameContainer';
import ChallengeDisplay from './ChallengeDisplay';
import Contact from './Contact';
import About from './About';
import Foxy from './Foxy';
import Credits from './Credits';
import CreateUser, { StandbyForVerification } from './CreateUser';
import Terms from './Terms';
import Rules from './Rules';
import AboutContact from './AboutContact';
import Video from './Video';


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
      <Route path="/challenges" component={ChallengeDisplay} />
      <Route path="/aboutcontact" component={AboutContact} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/createuser" component={CreateUser} />
      <Route path='/shopping' component={Foxy} />
      <Route path='/credits' component={Credits} />
      <Route path='/verifyuser' component={StandbyForVerification} />
      <Route path='/terms' component={Terms} />
      <Route path='/rules' component={Rules} />
      <Route path='/video' component={Video} />
    </div>
  );
};

export default App;