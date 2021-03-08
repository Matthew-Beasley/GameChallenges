import React, {useState, useEffect} from 'react';
import {RecoilState, useRecoilState} from 'recoil';
import { playerListState } from './RecoilState';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// eslint-disable-next-line react/prop-types
const NavModal = ({ index, letter }) => {
  const [players, setPlayers] = useRecoilState(playerListState);
  const [isOpen, setIsOpen] = useState(false);

  const  toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const retirePlayer = () => {
    const tmpArr = [...players];
    tmpArr.splice(index, 1);
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
        <button className="retirre-bttn" onClick={() => {retirePlayer(); toggleModal()}}>Bye guys!</button>
      </Modal>
      <div className="player-dot" onClick={toggleModal}>
        <div 
          className="player-initial">{letter}
          {console.log('key in NavModal ', index)}
        </div>
      </div> 
    </div>
  );
};

export default NavModal;