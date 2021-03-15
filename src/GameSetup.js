import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playerListState, challengesState, csrfState, queryState, headerState, userState } from './RecoilState';
import { useHistory } from 'react-router-dom';

const GameSetup = () => {
  const history = useHistory();
  const headers = useRecoilValue(headerState);
  const [players, setPlayers] = useRecoilState(playerListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [user, setUser] = useRecoilState(userState);
  const [csrf, setCsrf] = useRecoilState(csrfState);
  const [displayGames, setDisplayGames] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [PCChk, setPCChk] = useState(false);
  const [XboxChk, setXboxChk] = useState(false);
  const [PlaystationChk, setPlaystationChk] = useState(false);
  const [SwitchChk, setSwitchChk] = useState(false);
  const [MobileChk, setMobileChk] = useState(false);
  const [query, setQuery] = useState(queryState);


  const addUserName = () => {
    if( !playerName) {
      alert('Oops! Player name can\'t be empty');
    } else {
      setPlayers([...players, playerName]);
      setPlayerName('');
    }
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
    const tempChallenges = [...challenges];
    for (let i = 0; i < tempChallenges.length; i++) {
      if (tempChallenges[i].Game === ev.target.id) {
        const tempGame = {...tempChallenges[i]};
        tempGame.show = ev.target.checked;
        tempChallenges.splice(i, 1);
        tempChallenges.splice(i, 0, tempGame);
      }
    }
    setChallenges([...tempChallenges]);
  };

  const findGames = async () => {
    const games = await axios.post('/challenge/games', query, headers);
    const display = new Set();
    for (let i = 0; i < games.data.games.length; i++) {
      display.add(games.data.games[i].Game);
    }
    setDisplayGames([...display]);
    setChallenges([...games.data.games]);
  };

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
    setQuery({$or: []});
  }, []);

  useEffect(() => {
    if(query.$or) {
      if (query.$or.length < 1) {
        setChallenges([]);
      } else {
        findGames();
      }
    }
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
            placeholder="Enter player name" 
            value={playerName}
            onChange={ev => setPlayerName(ev.target.value)} 
          />
          <button id="player-submit-btn" onClick={() => addUserName()}>+</button>
        </div>
      </div>
      <div id="platform-groups">
        <div className="platform-checkgroup">
          <div>
            <input 
              type="checkbox" 
              checked={PCChk}
              onChange={(ev) => {selectPlatform('PC'); setPCChk(ev.target.checked);}}
            />
            <label>PC</label>
          </div>
          <div>
            <label>&nbsp;&nbsp;Xbox</label>
            <input 
              type="checkbox" 
              checked={XboxChk}
              onChange={(ev) => {selectPlatform('Xbox'); setXboxChk(ev.target.checked);}}
            />
          </div>
        </div>
        <div className="platform-checkgroup">
          <div>    
            <input 
              type="checkbox" 
              checked={PlaystationChk}
              onChange={(ev) => {selectPlatform('PS'); setPlaystationChk(ev.target.checked);}}
            />
            <label>Playstation</label>
          </div>
          <div>
            <label>Switch</label>
            <input 
              type="checkbox" 
              checked={SwitchChk}
              onChange={(ev) => {selectPlatform('Switch'); setSwitchChk(ev.target.checked);}}
            />
          </div> 
        </div>
        <div className="platform-checkgroup">
          <div>
            <input 
              type="checkbox" 
              checked={MobileChk}
              onChange={(ev) => {selectPlatform('Mobile'); setMobileChk(ev.target.checked);}}
            />
            <label>Mobile</label>
            <div id="mobile-spacer"></div>
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