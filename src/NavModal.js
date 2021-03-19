import React, {useState, useEffect} from 'react';
import {RecoilState, useRecoilState} from 'recoil';
import { playerListState } from './RecoilState';
import { Button, Icon, Header, Modal } from 'semantic-ui-react';


// eslint-disable-next-line react/prop-types
const NavModal = ({ index, letter }) => {
  const [players, setPlayers] = useRecoilState(playerListState);
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = useState(0);

  const retirePlayer = () => {
    const tmpArr = [...players];
    tmpArr.splice(index, 1);
    setPlayers([...tmpArr]);
  };

  return (
    <div id="navmodal-container">
      <Modal
        closeIcon
        size='tiny'
        dimmer='blurring'
        open={open}
        trigger={ 
          <div className="player-dot" >
            <div 
              className="player-initial">{letter}
            </div>
          </div> }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon='archive' content='Player Options' />
        <Modal.Actions>
          <Button color='green' onClick={(ev) => {addPoint(ev); setOpen(false)}}>
            <Icon name='check' />Add Point
          </Button>
          <Button color='green' onClick={() => {retirePlayer(); setOpen(false)}}>
            <Icon name='check' />Quit
          </Button>
          <Button color='red' onClick={() => setOpen(false)}>
            <Icon name='remove' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default NavModal;