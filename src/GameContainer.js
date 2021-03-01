import React, { useState, useEffect } from 'react';
import { Route, Link, history } from 'react-router-dom';
import NavBar from './NavBar';
import GameSetup from './GameSetup';
import ChallengeDisplay from './ChallengeDisplay';
import Ads from './Ads';

const GameContainer = () => {

  return (
    <div id="game-container">
      <NavBar />
      <div id='main-gamecomponents'>
        <GameSetup />
        <ChallengeDisplay />
        <Ads />
      </div>
    </div>
  );
};

export default GameContainer;