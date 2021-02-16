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
        <div id="setup-header-text">Thwartme game setup page!</div>
        <div id="instruction-wrapper">
          <div id="platform-instructions">Select games by platform</div>
        </div>
        <PlatformSelector />
      </div>
    </div>
  );
};

export default GameSetup;