import React, { useEffect } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue} from 'recoil';
import { useCookies } from 'react-cookie';
import { tokenState, csrfState, headerState, userState } from './RecoilState';


const NavBar = () => {
  const [user, setUser] = useRecoilState(userState);

  const [token, setToken] = useRecoilState(tokenState);
  //const [csrf, setCsrf] = useRecoilState(csrfState);
  //const headers = useRecoilValue(headerState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const history = useHistory();

  const logout = () => {
    removeCookie('token');
    setToken('');
    setUser({});
    history.push('/');
    window.location.href = window.location.href.split('?')[0];
  };

  useEffect(() => {

  }, [user]);

  return (
    <div id="navbar">
      <div className="nav-links">
        <Link to="/" >Thwart Me</Link><label>|</label><Link to="/rules" >How to Play</Link><label>|</label><Link to="/shopping" >Shop</Link>
        
        {/*<a href="https://discord.gg/tdyGFH6dwu" target="_blank" rel="noopener noreferrer">Discord Channel</a>*/}
      </div>
      {console.log('history.location: ', history.location)}
      {!user.email  &&
        <div className="nav-links">
          <Link to="/">Sign in</Link>
        </div>
      }
      {!!user.email && 
        <div className="logout-text nav-links" onClick={() => logout()}>
          Logout
        </div>
      }
    </div>
  );
};

export default NavBar;