import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playersState, challengesState, csrfState, headerState, tokenState, userState } from './RecoilState';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Players from './Players';

const GameSetup = () => {
  const history = useHistory();
  const headers = useRecoilValue(headerState);
  const [players, setPlayers] = useRecoilState(playersState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [token, setToken] = useRecoilState(tokenState);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
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
  const [timeLimit, setTimeLimit] = useState(0);
  /*
  const lookForEnter = (ev) => {
    ev.key === 'Enter' ? addUserName : null;
  };
*/
  const addUserName = () => {
    if( !playerName) {
      alert('Oops! Player name can\'t be empty');
    } else {
      //choose a character
      const contestant = { Name: playerName, MyTurn: false, Score: 0, Background: `character${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}`} ;
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

  const multiSelectPlatform = (ev) => {
    for (let i = 0; i < ev.target.length; i++) {
      switch (ev.target[i].text) {
      case 'PC':
        setPCChk(ev.target[i].selected);
        return;
      case 'Xbox':
        setXboxChk(ev.target[i].selected);
        return;
      case 'PS':
        setPlaystationChk(ev.target[i].selected);
        return;
      case 'Switch':
        setSwitchChk(ev.target[i].selected);
        return;
      case 'Mobile':
        setMobileChk(ev.target[i].selected);
        return;
      default:
        return;
      }
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
      setTimeLimit(parseInt(ev.target.value));
      return;
    default:
      return;
    }
  };

  const getDecks = async () => {
    const decks = [];
    if (user.decks) {
      for (let i = 0; i < user.decks.length; i++) {
        let query = {
          DeckName: user.decks[i].name,
          DeckCode: user.decks[i].code
        };
        const response = await axios.post('/challenge/decks', query, headers);
        decks.push(...response.data);
      }
    }
    return decks;
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
      if (tmpChallenges[i].TimeLimit && [...parsed][i]) {
        [...parsed][i]['TimeLimitInt'] = parseInt(tmpChallenges[i].TimeLimit.slice(0, tmpChallenges[i].TimeLimit.indexOf(' ')));
      }
    }
    let switched = [...parsed];
    if (splitScreen === 'true') {
      switched = switched.filter(challenge => challenge.SplitScreen !== false);
    }
    if (kidFriendly === 'true') {
      switched = switched.filter(challenge => challenge.KidFriendly !== false);
    }
    if (online === 'true') {
      switched = switched.filter(challenge => challenge.Online !== false);
    }
    if (online === 'false') {
      switched = switched.filter(challenge => challenge.Online !== true);
    }
    switched = switched.filter(challenge => {
      if (challenge.TimeLimitInt <= 5 && timeLimit === 5) {
        return challenge; 
      } else if (challenge.TimeLimitInt <= 15 && timeLimit === 15) {
        return challenge;
      } else if (challenge.TimeLimitInt > 15 && timeLimit === 16) {
        return challenge;
      } else if (!timeLimit) {
        return challenge;
      }
    });
    setChallenges(switched);
  };

  const getChallenges = (ev) => {
    const tempChallenges = [...challenges];
    for (let i = 0; i < tempChallenges.length; i++) {
      if (tempChallenges[i].Game === ev.target.id || tempChallenges[i].Game === ev.target.value) {
        const tempGame = {...tempChallenges[i]};
        if ('checked' in ev.target) {
          tempGame.show = ev.target.checked;
        } else if (ev.target.value, tempChallenges[i].Game) { //refactor this
          tempGame.show = true;
        }
        tempGame.show = true;
        tempChallenges.splice(i, 1);
        tempChallenges.splice(i, 0, tempGame);
      }
    }
    setChallenges([...tempChallenges]);
  };

  useEffect(() => {
    axios.defaults.headers.post['X-CSRF-Token'] = cookies.CSRF_token;
    if(!user.email) {
      axios.post('/user/token', { token: cookies.token }, headers)
        .then(response => {
          setUser(response.data[0]);
        });
    }
  }, []);

  useEffect(() => {
    parseChallneges();
  }, [user, PCChk, XboxChk, PlaystationChk, SwitchChk, MobileChk, splitScreen, kidFriendly, online, timeLimit]);

  useEffect(() => {
    getDisplayGames();
  }, [challenges]);

  return (
    <div id="gamesetup-container">
      <Players />
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
        <select multiple onChange={ev => multiSelectPlatform(ev)}>
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
          <option value="16">Over 15 minutes</option>
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
        <button onClick={() => history.push('/challenges')}>LETS PLAY!</button>
      </div>
    </div>
  );
};

export default GameSetup;