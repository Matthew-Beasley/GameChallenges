import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './RecoilState';
import GameSetup from './GameSetup';
import ChallengeDisplay from './ChallengeDisplay';
import Players from './Players';
import NavBar from './NavBar';

const GameContainer = () => {
  const [user, setUser] = useRecoilState(userState);
  const history = useHistory();

  useEffect(() => {
    console.log('user email ', user.email)
    if (!user.email) {
      history.push('/');
    }
  }, []);

  return (
    <div id="game-container">
      <NavBar />
      <div id='main-gamecomponents'>
        <GameSetup />
        <ChallengeDisplay />
        <Players />
      </div>
    </div>
  );
};

export default GameContainer;