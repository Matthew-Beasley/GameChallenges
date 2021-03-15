import React, {useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import CreateUser from './CreateUser';
import Login from './Login';
import GameContainer from './GameContainer';
import Contact from './Contact';
import About from './About';
import ChallengeDisplay from './ChallengeDisplay';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenState, csrfState, userState, headerState } from './RecoilState';

const App = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const [token, setToken] = useRecoilState(tokenState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [user, setUser] = useRecoilState(userState);
  const headers = useRecoilValue(headerState);

  useEffect(() => {
    setToken(cookies.token);
    setCsrf(cookies.CSRF_token);
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, []);

  useEffect(() => {
    if (token) {
      axios.post('/user/token', { token: token }, headers).then(response => {
        setUser(response.data[0]);
      });
    }
    console.log('token in app useEffect[token] ', token);
  }, [token]);

  if (!token){
    return (
      <div id="start">
        <Route exact path="/" component={Login} />
        <Route path="/createuser" component={CreateUser} />
      </div>
    );
  }
  else {
    return (
      <div id="app-container">
        <Route exact path={'/' || 'game-container'} component={GameContainer} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/challenges" component={ChallengeDisplay} />
      </div>
    );
  }
};

export default App;