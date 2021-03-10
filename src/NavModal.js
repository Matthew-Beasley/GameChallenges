import React, {useState, useEffect} from 'react';
import {RecoilState, useRecoilState} from 'recoil';
import { playerListState } from './RecoilState';
import { Button, Icon, Image, Modal } from 'semantic-ui-react';


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
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        trigger={ <div className="player-dot" onClick={() => setOpen(true)}>
          <div 
            className="player-initial">{letter}
          </div>
        </div> }
      >
        <Modal.Header>Modal Header</Modal.Header>
        <Modal.Content image>
          <Image size='medium' src='/images/wireframe/image.png' wrapped />
          <Modal.Description>
            <p>
            This is an example of expanded content that will cause the modal's
            dimmer to scroll.
            </p>

            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image
              src='/images/wireframe/paragraph.png'
              style={{ marginBottom: 10 }}
            />
            <Image src='/images/wireframe/paragraph.png' />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => setOpen(false)}>
          Proceed <Icon name='right chevron' />
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default NavModal;