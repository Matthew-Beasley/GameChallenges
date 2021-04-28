import React, {useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, userState, headerState } from './RecoilState';
import LandingPage from './LandingPage';
import CreateUser from './CreateUser';
import Login from './Login';
import GameContainer from './GameContainer';
import Contact from './Contact';
import About from './About';


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
      {!!token && <Route path="/gamepage" component={GameContainer} />}
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      {!token && <Route path="/login" component={Login} />}
      {!token && <Route path="/createuser" component={CreateUser} />}
    </div>
  );
};

export default App;