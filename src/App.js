import React, {useState, useEffect} from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './RecoilState';

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
      <Header />
      <Nav history={history} />
      <Route exact path="/" render={() => <HomeView />} />
      <Route path="/UserView" render={() => <UserView headers={headers} />} />
      <Route path="/Admin" render={() => <Admin headers={headers} />} />
    </div>
  )
}

export default App;