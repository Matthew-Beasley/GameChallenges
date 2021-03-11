import React, {useState, useEffect} from 'react';
import {RecoilState, useRecoilState} from 'recoil';
import { playerListState } from './RecoilState';
import { Button, Icon, Header, Modal } from 'semantic-ui-react';


// eslint-disable-next-line react/prop-types
const NavModal = ({ index, letter }) => {
  const [players, setPlayers] = useRecoilState(playerListState);
  const [open, setOpen] = React.useState(false);

  const retirePlayer = () => {
    const tmpArr = [...players];
    tmpArr.splice(index, 1);
    setPlayers([...tmpArr]);
  };

  return (
    <div id="navmodal-container">
      <Modal
        closeIcon
        size='mini'
        dimmer='blurring'
        open={open}
        trigger={ 
          <div className="player-dot" onClick={() => setOpen(true)}>
            <div 
              className="player-initial">{letter}
            </div>
          </div> }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon='archive' content='Leave the Game' />
        <Modal.Content>
          <p>
            I'm Outa Here!
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            <Icon name='remove' /> No
          </Button>
          <Button color='green' onClick={() => {retirePlayer(); setOpen(false)}}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default NavModal;