import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './RecoilState';
import GameSetup from './GameSetup';
import ChallengeDisplay from './ChallengeDisplay';
import Players, { PlayerButtons } from './Players';
import NavBar from './NavBar';

const GameContainer = () => {
  const [user, setUser] = useRecoilState(userState);
  const history = useHistory();

  useEffect(() => {
    if (!user.email) {
      history.push('/');
    }
  }, []);

  return (
    <div id="game-container">
      <NavBar />
      <div id='main-gamecomponents'>
        <GameSetup />
        <div id="sub-gamecomponents">
          <Players />
          <ChallengeDisplay />
          <PlayerButtons />
        </div>
      </div>
      <div id="phone-gamecomponents">
        <GameSetup />
      </div>
    </div>
  );
};

export default GameContainer;