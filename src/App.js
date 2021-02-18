import React, {useState, useEffect} from 'react';
import { Route, Link, useHistory, withRouter } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import CreateUser from './CreateUser';
import Login from './Login';
import GameContainer from './GameContainer';
import Contact from './Contact';
import About from './About';

const App = () => {
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useState('');
/*
  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
  }, [user]);
*/
  return (
    <div id="app-container">
      <Route exact path="/" component={GameContainer} />
      <Route path="/createUser" component={CreateUser} />
      <Route path="/login" component={Login} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;