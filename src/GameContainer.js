import React, { useState, useEffect } from 'react';
import { Route, Link, history } from 'react-router-dom';
import NavBar from './NavBar';
import GameSetup from './GameSetup';
import { ChallengeDisplay, MobileChallenges } from './ChallengeDisplay';

const GameContainer = () => {

  return (
    <div id="game-container">
      <NavBar />
      <div id='main-gamecomponents'>
        <GameSetup />
        <ChallengeDisplay />
        
      </div>
    </div>
  );
};

export default GameContainer;