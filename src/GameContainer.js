import React, { useState, useEffect } from 'react';
import { Route, Link, history } from 'react-router-dom';
import NavBar from './NavBar';
import GameSetup from './GameSetup';

const GameContainer = () => {

  return (
    <div id="game-container">
      <NavBar />
      <GameSetup />
    </div>
  );
};

export default GameContainer;