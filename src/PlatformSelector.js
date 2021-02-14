/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, 
  passwordState, 
  tokenState, 
  platformsState, 
  headerState,
  platformsInPlayState,
  gamesInPlayState } from './RecoilState';


const GameDisplay = ({ platform }) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  return (
    <div>
      <div className="clickable-platform" onClick={() => toggle()}><p>{platform.name}</p></div>
      {show ? <ul id="game-list">
        {platform.games.map((item, idx) => {
          return (
            <li key={idx} >{item}</li>
          );
        })}
      </ul> : null}
    </div>
  );
};


const PlatformSelector = () => {
  const header = useRecoilValue(headerState);
  const [platforms, setPlatforms] = useRecoilState(platformsState);

  useEffect(() => {
    axios.get('/platform', header)
      .then(response => setPlatforms(response.data));
  },[]);

  return (
    <div id="platform-selector">
      <ul>
        {platforms.map((item, idx) => {
          return (
            <li className="platform-item" key={idx} >
              <GameDisplay platform={item} /> 
            </li>
          );
        })}
      </ul>
    </div>);
};

export default PlatformSelector;
