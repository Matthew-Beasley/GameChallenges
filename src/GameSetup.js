import axios from 'axios';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { playerListState, gameListState, selectedTitlesState } from './RecoilState';
import { useHistory } from 'react-router-dom';

const GameSetup = () => {
  const history = useHistory();
  const [players, setPlayers] = useRecoilState(playerListState);
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [selectedTitles, setSelectedTitles] = useRecoilState(selectedTitlesState);
  const [displayGames, setDisplayGames] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const platforms = ['PC', 'Xbox', 'Playstation',	'Switch', 'Mobile'];


  const query = { $or: [{ KidFriendly: false }, ] };

  const addUserName = () => {
    setPlayers([...players, playerName]);
    setPlayerName('');
  };

  const selectPlatform = (platform) => {
    if (!query.$or.find(el => el[platform] === true)) {
      const platformObj = {[platform]: true};
      query.$or.push(platformObj);
    } else {
      const index = query.$or.findIndex(el => el[platform] === true);
      query.$or.splice(index, 1);
    }
  };

  const setControlVal = (ev) => {
    const index = query.$or.findIndex(el => el[ev.target.id]);
    if (index > -1) {
      query.$or.splice(index, 1);
    }
    if (!ev.target.value === '') {
      query.$or.push({ [ev.target.id]: ev.target.value });
    }
  };

  const chooseTitle = (ev) => {
    if (ev.target.checked === undefined) {
      if (!selectedTitles.includes(ev.target.value)) {
        setSelectedTitles([...selectedTitles, ev.target.value]);
      } else {
        const tempArr = [...selectedTitles];
        const index = tempArr.findIndex(el => el === ev.target.value);
        tempArr.splice(index, 1);
        setSelectedTitles([...tempArr]);
      }
    } else if (ev.target.checked === true) {
      setSelectedTitles([...selectedTitles, ev.target.parentNode.innerText]);
    } else if (ev.target.checked === false) {
      const tempArr = [...selectedTitles];
      const index = tempArr.findIndex(el => el === ev.target.parentNode.innerText);
      tempArr.splice(index, 1);
      setSelectedTitles([...tempArr]);
    }
  };
 
  const findGames = async () => {
    const games = await axios.post('/challenge/games', query);
    setGameList([...games.data]);
    const display = new Set();
    for (let i = 0; i < games.data.length; i++) {
      display.add(games.data[i].Game);
    }
    setDisplayGames([...display]);
  };

  return (
    <div id="gamesetup-container">
      <div className="setup-control" id="players">
        <label>Players</label>
        <div id="text-bttn-combo">
          <input 
            id="player-input" 
            type="text" 
            value={playerName} 
            placeholder="Enter player name" 
            onChange={ev => setPlayerName(ev.target.value)} 
          />
          <button id="player-submit-btn" onClick={() => addUserName()}>+</button>
        </div>
      </div>
      <div className="setup-control" id="platform-control">
        <label>Platforms</label>
        <div id="scroller">
          <div id="platform-list">
            {platforms.map((platform, idx) => {
              return (<div key={idx} className="platform-list-item">
                <input 
                  className="platform-list-input" 
                  type="checkbox" 
                  onChange={() => selectPlatform(platform)}/>
                {platform}
              </div>);
            })}
          </div>
        </div>
      </div>
      <div className="setup-control" id="phone-platformselect">
        <label>Platforms</label>
        <select multiple onChange={ev => selectPlatform(ev.target.value)}>
          {platforms.map((platform, idx) => {
            return (<option key={idx} value={platform}>{platform} </option>);
          })}
        </select>
      </div>
      <div className="setup-control" id="splitscreen-select">
        <label>Split screen</label>
        <select id="SplitScreen" onChange={ev => setControlVal(ev)}>
          <option value="">No preference</option>
          <option value="true">Split screen</option>
          <option value="false">No split screen</option>
        </select>
      </div>
      <div className="setup-control" id="kidfriendly-select">
        <label>Kid friendly</label>
        <select id="KidFriendly" onChange={ev => setControlVal(ev)}>
          <option value="">No preference</option>
          <option value="true">Kid friendly</option>
          <option value="false">Adults only</option>
        </select>
      </div>
      <div className="setup-control" id="onlineSelect">
        <label>Online only</label>
        <select id="Online" onChange={ev => setControlVal(ev)}>
          <option value="">No preference</option>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>
      </div>
      <div className="setup-control" id="timeLimit">
        <label>Time Limit</label>
        <select id="TimeLimit" onChange={ev => setControlVal(ev)}>
          <option value="">No preference</option>
          <option value="5">5 minutes or Less</option>
          <option value="15">15 minutes or Less</option>
          <option value="Infinity">Over 15 minutes</option>
        </select>
      </div>
      <div id="findgames">
        <button onClick={() => findGames()} >Find Games</button>
      </div>
      <div className="setup-control" id="multi-control">
        <label>Games</label>
        <div id="scroller">
          <div id="multi-list">
            {displayGames.map((game, idx) => {
              return (<div key={idx} className="multi-list-item">
                <input className="multi-list-input" type="checkbox" onChange={ev => chooseTitle(ev)}/>{game}
              </div>);
            })}
          </div>
        </div>
      </div>
      <div id="phone-gameselect">
        {!!gameList.length > 0 ? <div>Choose your games below!</div> : <div> </div>}
        <label>Games</label>
        <select multiple onChange={ev => chooseTitle(ev)}>
          {displayGames.map((game, idx) => {
            return (<option key={idx}>{game}</option>);
          })}
        </select>
      </div>
      <div id="lets-play">
        <button onClick={() => history.push('./challenges')}>LETS PLAY!</button>
      </div>
    </div>
  );
};

export default GameSetup;