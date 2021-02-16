import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import PlatformSelector from './PlatformSelector';

const GameSetup = () => {

  return (
    <div id="game-setup-container">
      <div>
        <div id="setup-header-text">Thartme game setup page!</div>
        <div id="instruction-wrapper">
          <div id="platform-instructions">Thartme game setup page!</div>
        </div>
        <PlatformSelector />
      </div>
    </div>
  );
};

export default GameSetup;