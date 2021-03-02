import React, { useState, useEffect } from 'react';
import { Route, Link, history } from 'react-router-dom';
import NavBar from './NavBar';
import GameSetup from './GameSetup';
import ChallengeDisplay from './ChallengeDisplay';
import Ads from './Ads';
import { set } from 'mongoose';

const GameContainer = () => {
  const [width, setWidth] = useState(window.screen.width);
  window.onresize = function (ev) {
    setWidth(window.screen.width);
    console.log('width = ', width);
  };

  return (
    <div id="game-container">
      <NavBar />
      <div id='main-gamecomponents'>
        <GameSetup />
        {width > 600 && <ChallengeDisplay />}
        {width > 600 && <Ads />}
      </div>
    </div>
  );
};

export default GameContainer;