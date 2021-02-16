import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import PlatformSelector from './PlatformSelector';

const GameSetup = () => {
  const history = useHistory();
  //console.log(history);

  return (
    <div>
      <h1>I made it to the game setup page!</h1>
      <PlatformSelector />
    </div>
  );
};

export default GameSetup;