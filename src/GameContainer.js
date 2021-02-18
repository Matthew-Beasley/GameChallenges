import React, { useState, useEffect } from 'react';
import { Route, Link, history } from 'react-router-dom';
import NavBar from './NavBar';

const GameContainer = () => {

  return (
    <div id="game-container">
      <NavBar />
    </div>
  );
};

export default GameContainer;