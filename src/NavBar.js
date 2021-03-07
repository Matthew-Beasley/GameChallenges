import React, {useState, useEffect} from 'react';
import { Route, Link, history } from 'react-router-dom';
import { RecoilState, useRecoilState } from 'recoil';
import Modal from 'react-modal';
import { playerListState } from './RecoilState';

Modal.setAppElement('#root');

const NavBar = () => {
  const [initials, setInitials] = useState([]);
  const [players, setPlayers] = useRecoilState(playerListState);
  const [isOpen, setIsOpen] = useState(false);

  const  toggleModal = () => {
    setIsOpen(!isOpen);
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
        {initials.map((letter, idx) => {return ( 
          <div 
            key={idx} 
            className="player-dot"
            onClick={toggleModal}
          >
            <div 
              className="player-initial">{letter}
            </div>
          </div> );})}
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        overlayClassName="myoverlay"
        contentLabel="My dialog"
        className="mymodal"
        closeTimeoutMS={500}
      >
        <div>My modal dialog.</div>
        <button onClick={toggleModal}>Close modal</button>
      </Modal>
    </div>
  );
};

export default NavBar; 