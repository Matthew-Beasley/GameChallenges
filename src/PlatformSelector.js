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
  selectedGameState,
  selectedGamesState} from './RecoilState';


const GameListItem = ({ game, platform }) => {
  const [gameSelected, setGameSelected] = useState(false);
  const [userGames, setUserGames] = useRecoilState(selectedGamesState);

  const gameObject = {};

  const toggleSelected = () => {
    if (gameSelected) {
      const tempArray = [...userGames];
      const indexToDelete = tempArray.findIndex(i => i.gameName === game);
      if (indexToDelete > -1) {
        tempArray.splice(indexToDelete, 1);
        setUserGames([...tempArray]);
      }
      setGameSelected(false);
    } else {
      if (userGames.findIndex(i => i.gameName === game) < 0) {
        gameObject.gameName = game;
        gameObject.platform = platform.name;
        setUserGames([...userGames, gameObject]);
      }
      setGameSelected(true);
    }
  };
  return (
    <li className={!gameSelected ? 'gameNotSelected' : 'gameSelected'} onClick={() => toggleSelected()}>{game}</li>
  );     
};


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
        {platform.games.map((game, idx) => {
          return (
            <GameListItem key={idx} game={game} platform={platform} />
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
