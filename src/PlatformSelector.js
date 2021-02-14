/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, passwordState, tokenState, platformsState, headerState } from './RecoilState';


const GameDisplay = ({ platform }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div>
      {console.log('platform in GameDisplay ', platform)}
      {toggle ? <div className="arrow" onClick={() => setToggle(false)}><p>&#9651;</p></div> :
        <div className="arrow" onClick={() => setToggle(true)}>&#9661;</div>}
      {toggle ? <ul id="game-list">
        {platform.games.map((item, idx) => {
          return (
            <li key={idx} >{item}</li>
          );
        })}
      </ul> : null}
    </div>);
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
          let display = false;
          return (
            <li className="platform-item" key={idx} >{item.name}
              <GameDisplay platform={item} /> 
            </li>
          );
        })}
      </ul>
    </div>);
};

export default PlatformSelector;
