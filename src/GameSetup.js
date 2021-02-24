import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playerListState, challengesState, gameListState } from './RecoilState';
import { useHistory } from 'react-router-dom';

const GameSetup = () => {
  const history = useHistory();
  const [players, setPlayers] = useRecoilState(playerListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [splitScreen, setSplitScreen] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const platforms = ['PC', 'Xbox', 'Playstation',	'Switch', 'Mobile'];
  /*const query = {
    Platforms: [],
    SplitScreen: false,
    KidFriendly: false,
    Online: false,
    TimeLimit: ''
  };*/

  const query = { $or: [] };

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

  const setCheckBoxVal = (ev) => {
    const index = query.$or.findIndex(el => el[ev.target.id]);
    if (index > -1) {
      query.$or.splice(index, 1);
    }
    query.$or.push({ [ev.target.id]: [ev.target.checked] });
  };

  const selectValue = (ev) => {
    // pick up here to add platform objects to $or array
    query[ev.target.id] = ev.target.value;
  };

  const findGames = async () => {
    const games = await axios.post('/challenge/games', query);
    console.log(games.data)
    setGameList(games.data);
  };

  return (
    <div id="gamesetup-container">
      <div id="players">
        <label>Players</label>
        <input 
          id="player-input" 
          type="text" 
          value={playerName} 
          placeholder="Enter player name" 
          onChange={ev => setPlayerName(ev.target.value)} />
        <button id="player-submit-btn" onClick={() => addUserName()}>+</button>
      </div>
      <div id="platform-control">
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
      <div id="phone-platformselect">
        <label>Platforms</label>
        <select multiple onChange={ev => selectPlatform(ev.target.value)}>
          {platforms.map((platform, idx) => {
            return (<option key={idx} value={platform}>{platform} </option>);
          })}
        </select>
      </div>
      <div id="checkboxes">
        <label id="SplitScreen-label">Split screen only</label>
        <input id="SplitScreen" type="checkbox" onChange={ev => setCheckBoxVal(ev)} />
        <label id="kid-label">Kid friendly</label>
        <input id="kidFriendly" type="checkbox" onChange={ev => setCheckBoxVal(ev)} />
      </div>
      <div id="onlineSelect">
        <label>Online only</label>
        <select id="Online" onChange={ev => selectValue(ev)}>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>
      </div>
      <div id="timeLimit">
        <label>Time Limit</label>
        <select id="TimeLimit" onChange={(ev) => selectValue(ev)}>
          <option value="all">All</option>
          <option value="5">5 minutes or Less</option>
          <option value="15">15 minutes or Less</option>
          <option value="Infinity">Over 15 minutes</option>
        </select>
      </div>
      <div id="findgames">
        <button onClick={() => findGames()} >Find Games</button>
      </div>
      <div id="multi-control">
        <label>Games</label>
        <div id="scroller">
          <div id="multi-list">
            {gameList.map((game, idx) => {
              return (<div key={idx} className="multi-list-item"><input className="multi-list-input" type="checkbox" />{game.Game}</div>);
            })}
          </div>
        </div>
      </div>
      <div id="phone-gameselect">
        <label>Games</label>
        <select multiple>
          {gameList.map((game, idx) => {
            return (<option key={idx}>{game.Game}</option>);
          })}
        </select>
      </div>
      <div id="lets-play">
        <button onClick={() => history.push('./mobilechallenges')}>LETS PLAY!</button>
      </div>
    </div>
  );
};

export default GameSetup;