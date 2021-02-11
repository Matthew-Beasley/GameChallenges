import React, {useState, useEffect} from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './RecoilState';
import CreateUser from './CreateUser';
import Login from './Login';

const App = () => {
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useState('');
  const history = useHistory();

  const headers = () => {
    return {
      headers: {
        authorization: token
      }
    };
  };

  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
  }, [user]);

  return (
    <div id="app-container">
      <Route exact path="/" component={Login} />
      <Route path="/createUser" component={CreateUser} />
    </div>
  );
};

export default App;