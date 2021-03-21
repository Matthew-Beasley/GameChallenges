import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playersState, challengesState, csrfState, headerState, userState } from './RecoilState';
import { useHistory } from 'react-router-dom';
import e from 'express';

const GameSetup = () => {
  const history = useHistory();
  const headers = useRecoilValue(headerState);
  const [players, setPlayers] = useRecoilState(playersState);
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
  const [splitScreen, setSplitScreen] = useState('');
  const [kidFriendly, setKidFriendly] = useState('');
  const [online, setOnline] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
/*
  const lookForEnter = (ev) => {
    ev.key === 'Enter' ? addUserName : null;
  };
*/
  const addUserName = () => {
    if( !playerName) {
      alert('Oops! Player name can\'t be empty');
    } else {
      const contestant = { Name: playerName, MyTurn: false, Score: 0 };
      players.length ? contestant.MyTurn = false : contestant.MyTurn = true;
      setPlayers([...players, contestant]);
      setPlayerName('');
    }
  };

  const getDisplayGames = () => {
    const tmpGames = new Set();
    for (let i = 0; i < challenges.length; i++) {
      tmpGames.add(challenges[i].Game);
    }
    setDisplayGames([...tmpGames]);
  };

  const selectPlatform = (platform, ev) => {
    switch (platform) {
    case 'PC':
      setPCChk(ev.target.checked);
      return;
    case 'Xbox':
      setXboxChk(ev.target.checked);
      return;
    case 'PS':
      setPlaystationChk(ev.target.checked);
      return;
    case 'Switch':
      setSwitchChk(ev.target.checked);
      return;
    case 'Mobile':
      setMobileChk(ev.target.checked);
      return;
    default:
      return;
    }
  };

  const setControlVal = (ev) => {
    switch (ev.target.id) {
    case 'SplitScreen':
      setSplitScreen(ev.target.value);
      return;
    case 'KidFriendly':
      setKidFriendly(ev.target.value);
      return;
    case 'Online':
      setOnline(ev.target.value);
      return;
    case 'TimeLimit':
      setTimeLimit(ev.target.value);
      return;
    default:
      return;
    }
  };

  const getDecks = async () => {
    const games = [];
    if (user.decks) {
      for (let i = 0; i < user.decks.length; i++) {
        let query = {
          Game: user.decks[i].game,
          DeckNumber: user.decks[i].deck
        };
        const response = await axios.post('/challenge/games', query, headers);
        games.push(...response.data.games);
      }
    }
    return games;
  };

  const parseChallneges = async () => {
    const tmpChallenges = await getDecks();
    const parsed = new Set();
    for (let i = 0; i < tmpChallenges.length; i++) {
      if (PCChk === true && tmpChallenges[i].PC === true) {
        !parsed.has(tmpChallenges[i].Game) ? parsed.add(tmpChallenges[i]) : null;
      }
      if (XboxChk === true && tmpChallenges[i].Xbox === true) {
        !parsed.has(tmpChallenges[i].Game) ? parsed.add(tmpChallenges[i]) : null;
      }
      if (PlaystationChk === true && tmpChallenges[i].Playstation === true) {
        !parsed.has(tmpChallenges[i].Game) ? parsed.add(tmpChallenges[i]) : null;
      }
      if (SwitchChk === true && tmpChallenges[i].Switch === true) {
        !parsed.has(tmpChallenges[i].Game) ? parsed.add(tmpChallenges[i]) : null;
      }
      if (MobileChk === true && tmpChallenges[i].Mobile === true) {
        !parsed.has(tmpChallenges[i].Game) ? parsed.add(tmpChallenges[i]) : null;
      }
      if (splitScreen === 'true' && tmpChallenges[i].SplitScreen !== true) {
        parsed.forEach(item => item.Game === tmpChallenges[i].Game ? parsed.delete(item) : item);
      }
      if (kidFriendly === 'true' && tmpChallenges[i].kidFriendly !== true) {
        parsed.forEach(item => item.Game === tmpChallenges[i].Game ? parsed.delete(item) : item);
      }
      if (online === 'true' && tmpChallenges[i].Online !== true) {
        parsed.forEach(item => item.Game === tmpChallenges[i].Game ? parsed.delete(item) : item);
      }
      if (parseInt(timeLimit) !== 'NaN' &&  parseInt(tmpChallenges[i].TimeLimit.slice(0, 2)) !== 'NaN') {
        if (parseInt(timeLimit) <  parseInt(tmpChallenges[i].TimeLimit.slice(0, 2))) {
          parsed.forEach(item => item.Game === tmpChallenges[i].Game ? parsed.delete(item) : item);
        }
      }
    }
    setChallenges([...parsed]);
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

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = csrf;
  }, [user]);

  useEffect(() => {
    parseChallneges();
  }, [PCChk, XboxChk, PlaystationChk, SwitchChk, MobileChk, splitScreen, kidFriendly, online, timeLimit]);

  useEffect(() => {
    console.log('challenges ', challenges);
    getDisplayGames();
  }, [challenges]);

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
          <button id="player-submit-btn" /*onKeyPress={(ev) => lookForEnter(ev)}*/ onClick={() => addUserName()}>+</button>
        </div>
      </div>
      <div id="platform-groups">
        <div className="platform-checkgroup">
          <div>
            <input 
              type="checkbox" 
              checked={PCChk}
              onChange={(ev) => selectPlatform('PC', ev)}
            />
            <label>PC</label>
          </div>
          <div>
            <label>&nbsp;&nbsp;Xbox</label>
            <input 
              type="checkbox" 
              checked={XboxChk}
              onChange={(ev) => selectPlatform('Xbox', ev)}
            />
          </div>
        </div>
        <div className="platform-checkgroup">
          <div>    
            <input 
              type="checkbox" 
              checked={PlaystationChk}
              onChange={(ev) => selectPlatform('PS', ev)}
            />
            <label>Playstation</label>
          </div>
          <div>
            <label>Switch</label>
            <input 
              type="checkbox" 
              checked={SwitchChk}
              onChange={(ev) => selectPlatform('Switch', ev)}
            />
          </div> 
        </div>
        <div className="platform-checkgroup">
          <div>
            <input 
              type="checkbox" 
              checked={MobileChk}
              onChange={(ev) => selectPlatform('Mobile', ev)}
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
      <div className="setup-control" id="splitscreen">
        <label>Split screen</label>
        <select id="SplitScreen" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Split screen Only</option>
        </select>
      </div>
      <div className="setup-control" id="kidfriendly">
        <label>Kid friendly</label>
        <select id="KidFriendly" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Kid friendly</option>
        </select>
      </div>
      <div className="setup-control" id="online">
        <label>Online only</label>
        <select id="Online" onChange={ev => setControlVal(ev)}>
          <option value="">No Preference</option>
          <option value="true">Online Only</option>
          <option value="false">Offline Only</option>
        </select>
      </div>
      <div className="setup-control" id="timelimit">
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