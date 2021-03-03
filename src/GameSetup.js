import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playerListState, challengesState, gameListState, selectedTitlesState } from './RecoilState';
import { useHistory } from 'react-router-dom';

const GameSetup = () => {
  const history = useHistory();
  const [players, setPlayers] = useRecoilState(playerListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [displayGames, setDisplayGames] = useState([]);
  const [playerName, setPlayerName] = useState('');

  const [PCChk, setPCChk] = useState(true);
  const [XboxChk, setXboxChk] = useState(true);
  const [PlaystationChk, setPlaystationChk] = useState(true);
  const [SwitchChk, setSwitchChk] = useState(true);
  const [MobileChk, setMobileChk] = useState(true);

  const [query, setQuery] = useState({$or: []});


  const addUserName = (playerName) => {
    setPlayers([...players, playerName]);
    setPlayerName('');
  };

  const selectPlatform = (platform) => {
    const queryCopy = {...query};
    if (!queryCopy.$or.find(el => el[platform] === true)) {
      const platformObj = {[platform]: true};
      queryCopy.$or.push(platformObj);
    } else {
      const index = queryCopy.$or.findIndex(el => el[platform] === true);
      queryCopy.$or.splice(index, 1);
    }
    setQuery({...queryCopy});
  };

  const setControlVal = (ev) => {
    const queryCopy = {...query};
    const index = queryCopy.$or.findIndex(el => el[ev.target.id]);
    if (index > -1) {
      queryCopy.$or.splice(index, 1);
    }
    if (!ev.target.value === '') {
      queryCopy.$or.push({ [ev.target.id]: ev.target.value });
    }
    setQuery({...queryCopy});
  };

  const getChallenges = (ev) => {
    const queryCopy = {...query};
    const gameObj = {Game: ev.target.id};
    const index = queryCopy.$or.findIndex(el => el[ev.target.value]);
    if (index === -1) {
      queryCopy.$or.push(gameObj);
    } else {
      queryCopy.$or.splice(index, 1);
    }
    setQuery({...queryCopy});
  };

  const findGames = async () => {
    const games = await axios.post('/challenge/games', query);
    const display = new Set();
    for (let i = 0; i < games.data.length; i++) {
      display.add(games.data[i].Game);
    }
    console.log('games.data in findgames ', games.data);
    setDisplayGames([...display]);
    setChallenges([...games.data]);
  };

  useEffect(() => {
    const queryCopy = {...query};
    queryCopy.$or.push({'PC': true}); 
    queryCopy.$or.push({'Xbox': true}); 
    queryCopy.$or.push({'PS': true});
    queryCopy.$or.push({'Switch': true}); 
    queryCopy.$or.push({'Mobile': true});
    setQuery({...queryCopy});
  }, []);

  useEffect(() => {
    console.log('query in [query]', query);
    findGames();
  }, [query]);

  return (
    <div id="gamesetup-container">
      <div className="setup-control" id="players">
        <label>Players</label>
        <div id="text-bttn-combo">
          <input 
            id="player-input" 
            type="text" 
            checked={playerName} 
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
            <label>PC</label>
            <input 
              className="platform-list-input" 
              type="checkbox" 
              checked={PCChk}
              onChange={(ev) => {selectPlatform('PC'); setPCChk(ev.target.checked)}}
            />
            <label>Xbox</label>
            <input 
              className="platform-list-input" 
              type="checkbox" 
              checked={XboxChk}
              onChange={(ev) => {selectPlatform('Xbox'); setXboxChk(ev.target.checked);}}
            />
            <label>Playstation</label>
            <input 
              className="platform-list-input" 
              type="checkbox" 
              checked={PlaystationChk}
              onChange={(ev) => {selectPlatform('PS'); setPlaystationChk(ev.target.checked);}}
            />
            <label>Switch</label>
            <input 
              className="platform-list-input" 
              type="checkbox" 
              checked={SwitchChk}
              onChange={(ev) => {selectPlatform('Switch'); setSwitchChk(ev.target.checked);}}
            />
            <label>Mobile</label>
            <input 
              className="platform-list-input" 
              type="checkbox" 
              checked={MobileChk}
              onChange={(ev) => {selectPlatform('Mobile'); setMobileChk(ev.target.checked);}}
            />
          </div>
        </div>
      </div>
      <div className="setup-control" id="phone-platformselect">
        <label>Platforms</label>
        <select multiple onChange={ev => selectPlatform(ev.target.value)}>
          <option value="PC">PC</option>
          <option value="Xbox">Xbox</option>
          <option value="PS">Playstation</option>
          <option value="Switch">Switch</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>
      <div className="setup-control" id="splitscreen-select">
        <label>Split screen</label>
        <select id="SplitScreen" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Split screen Only</option>
          <option value="false">No split screen</option>
        </select>
      </div>
      <div className="setup-control" id="kidfriendly-select">
        <label>Kid friendly</label>
        <select id="KidFriendly" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Kid friendly</option>
          <option value="false">Adults only</option>
        </select>
      </div>
      <div className="setup-control" id="onlineSelect">
        <label>Online only</label>
        <select id="Online" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Online Only</option>
          <option value="false">Offline Only</option>
        </select>
      </div>
      <div className="setup-control" id="timeLimit">
        <label>Time Limit</label>
        <select id="TimeLimit" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="5">5 minutes or Less</option>
          <option value="15">15 minutes or Less</option>
          <option value="Infinity">Over 15 minutes</option>
        </select>
      </div>
      <div className="setup-control" id="multi-control">
        <label>Games</label>
        <div id="scroller">
          <div id="multi-list">
            {displayGames.map((game, idx) => {
              return (<div key={idx} className="multi-list-item">
                <input className="multi-list-input" id={game} type="checkbox" onChange={ev => getChallenges(ev)}/>{game}
              </div>);
            })}
          </div>
        </div>
      </div>
      <div className="setup-control" id="phone-gameselect">
        <label>Games</label>
        <select multiple id="Game" onChange={ev => getChallenges(ev)}>
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