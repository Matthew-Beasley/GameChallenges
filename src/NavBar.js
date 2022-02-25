import React, { useEffect } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue} from 'recoil';
import { useCookies } from 'react-cookie';
import { tokenState, csrfState, headerState, userState } from './RecoilState';
import { DropdownButton, Dropdown } from 'react-bootstrap';


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
    //history.push('/');
    window.location.href = window.location.href.split('?')[0];
  };

  useEffect(() => {

  }, [user]);

  return (
    <div id="navbar">
      <div className="nav-links">
        <DropdownButton id="dropdown-basic-button" title="About the Game">
          <Dropdown.Item href="#/rules">How to Play</Dropdown.Item>
          <Dropdown.Item href="#/about">About Us</Dropdown.Item>
          <Dropdown.Item href="#/contact">Contact Us</Dropdown.Item>
        </DropdownButton>
        <DropdownButton id="dropdown-basic-button" title="Game Links">
          <Dropdown.Item href="#/">Home</Dropdown.Item>
          <Dropdown.Item href="https://discord.gg/tdyGFH6dwu" target="_blank" rel="noopener noreferrer">Discord</Dropdown.Item>
        </DropdownButton>
        {!!user.email &&
        <DropdownButton id="dropdown-basic-button" title="Members Only">
          <Dropdown.Item href="#/shopping">Buy New Decks</Dropdown.Item>
          <Dropdown.Item href="#/gamepage">Play the Game</Dropdown.Item>
        </DropdownButton>}
        <DropdownButton id="dropdown-basic-button" title="Account">
          <Dropdown.Item href="#/login">Log In</Dropdown.Item>
          <Dropdown.Item href="#/createuser">Create An Account</Dropdown.Item>
          <Dropdown.Item onClick={() => logout()}>Log out</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
};

export default NavBar;