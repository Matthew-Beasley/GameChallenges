import React from 'react';
import GameSetup from './GameSetup';
import ChallengeDisplay from './ChallengeDisplay';
import Players from './Players';
import NavBar from './NavBar';

const GameContainer = () => {

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