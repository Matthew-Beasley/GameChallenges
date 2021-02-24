import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';
import { RecoilState, useRecoilState } from 'recoil';
import { playerListState } from './RecoilState';

const NavBar = () => {
  const [initials, setInitials] = useState([]);
  const [players, setPlayers] = useRecoilState(playerListState);

  useEffect(() => {
    const tempArray = [];
    players.forEach(item => {
      const firstLetter = item[0];
      tempArray.push(firstLetter);
    });
    setInitials(tempArray);
  }, [players]);

  return (
    <div id="navbar">
      <div id="nav-links">
        <Link to="/" >Thwart Me</Link>
        <Link to="/about" >About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div id="navbar-spacer"></div>
      <div>
        {initials.map((letter, idx) => {return ( <div key={idx} className="player-dot"><div className="player-initial">{letter}</div></div> )})}
      </div>
    </div>
  );
};

export default NavBar; 