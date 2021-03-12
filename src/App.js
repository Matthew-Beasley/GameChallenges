import React, {useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import CreateUser from './CreateUser';
import Login from './Login';
import GameContainer from './GameContainer';
import Contact from './Contact';
import About from './About';
import ChallengeDisplay from './ChallengeDisplay';
import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import { tokenState } from './RecoilState';
//import { set } from 'mongoose';

const App = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const [token, setToken] = useRecoilState(tokenState);
/*
  useEffect(() => {
    if (!token) {
      setToken(cookies.token);
    }
  }, []);
*/
  if (!token){
    return (
      <Route component={Login} />
    );
  }
  else {
    return (
      <div id="app-container">
        <Route exact path="/" component={GameContainer} />
        <Route path="/createuser" component={CreateUser} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/challenges" component={ChallengeDisplay} />
      </div>
    );
  }
};

export default App;