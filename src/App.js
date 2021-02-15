import React, {useState, useEffect} from 'react';
import { Route, Link, useHistory, withRouter } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import CreateUser from './CreateUser';
import Login from './Login';
import GameSetup from './GameSetup';

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
      <Route exact path="/" component={Login} />
      <Route path="/createUser" component={CreateUser} />
      <Route path="/gamesetup" component={GameSetup} />
    </div>
  );
};

export default App;