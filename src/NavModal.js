import React, {useState, useEffect} from 'react';
import {RecoilState, useRecoilState} from 'recoil';
import { playerListState } from './RecoilState';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NavModal = ({ letter }) => {
  const [players, setPlayers] = useRecoilState(playerListState);
  const [isOpen, setIsOpen] = useState(false);

  const  toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const retirePlayer = (idx) => {
    const tmpArr = [...players];
    tmpArr.splice(idx, 1);
    setPlayers([...tmpArr]);
  };

  return (
    <div id="navmodal-container">
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        overlayClassName="myoverlay"
        contentLabel="Player Stats"
        className="scores-modal"
        closeTimeoutMS={0}
      >
        <div className="modal-close" onClick={toggleModal}>x</div>
        <button className="retirre-bttn" onClick={() => retirePlayer()}>Bye guys!</button>
      </Modal>
      <div className="player-dot" onClick={toggleModal}>
        <div 
          className="player-initial">{letter}
        </div>
      </div> 
    </div>
  );
};

export default NavModal;