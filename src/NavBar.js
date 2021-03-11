import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';
import { RecoilState, useRecoilState } from 'recoil';
import Modal from 'react-modal';
import { playerListState } from './RecoilState';
import NavModal from './NavModal';

Modal.setAppElement('#root');

const NavBar = () => {
  const [initials, setInitials] = useState([]);
  const [players, setPlayers] = useRecoilState(playerListState);
  const [scoresOpen, setScoresOpen] = useState(false);

  const toggleScores = () => {
    setScoresOpen(!scoresOpen);
  };

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
      <div id="dot-list">
        {initials.map((letter, idx) => {
          return ( 
            <NavModal key={idx} index={idx} letter={letter} />
          );
        })} 
      </div>
    </div>
  );
};

export default NavBar; 