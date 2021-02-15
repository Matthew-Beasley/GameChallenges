import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { userState, passwordState, tokenState } from './RecoilState';
import PlatformSelector from './PlatformSelector';

const GameSetup = () => {
  return (
    <div>
      <h1>I made it to the game setup page!</h1>
    </div>
  )
}

export default GameSetup;