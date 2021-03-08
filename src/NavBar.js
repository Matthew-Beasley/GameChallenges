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
  // TODO: Should I put the letter in recoil?

  const toggleScores = () => {
    setScoresOpen(!scoresOpen);
  };

  const retirePlayer = (idx) => {
    const tmpArr = [...players];
    tmpArr.splice(idx, 1);
    setPlayers([...tmpArr]);
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
        <div id="scores" onClick={toggleScores}>Scores</div>
      </div>
      <Modal
        isOpen={scoresOpen}
        onRequestClose={toggleScores}
        overlayClassName="myoverlay"
        contentLabel="Player Stats"
        className="scores-modal"
        closeTimeoutMS={0}
      >
        <div className="modal-close" onClick={toggleScores}>x</div>
        <div>Scores</div>
        <div>Scores would go here </div>
      </Modal>
      <div id="dot-list">
        {initials.map((letter, idx) => {return ( 
          <NavModal key={idx} letter={letter} />
        );
        })} 
      </div>
    </div>
  );
};

export default NavBar; 