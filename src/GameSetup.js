import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playersState, challengesState, csrfState, headerState, tokenState, userState } from './RecoilState';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Players from './Players';
import Modal from 'react-modal';
//import Select from 'react-select';


const GameSetup = () =>   {
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
  const [usedCharacters, setUsedCharacters] = useState([]);


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
      if (players.length >= 6) {
        alert('Oops! Only 6 players can play at a time!');
      } else {
        let character = `character${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}`;
        while (usedCharacters.includes(character)) {
          character = `character${Math.floor(Math.floor(Math.random() * (8 - 1 + 1)) + 1)}`;
        }
        setUsedCharacters([...usedCharacters, character]);
        console.log(usedCharacters);
        const contestant = { Name: playerName, MyTurn: false, Score: 0, Background: character} ;
        players.length ? contestant.MyTurn = false : contestant.MyTurn = true;
        setPlayers([...players, contestant]);
      }
      setPlayerName('');
    }
  };

  const getChallenges = (ev) => {
    const tempChallenges = [...challenges];
    for (let i = 0; i < tempChallenges.length; i++) {
      if (tempChallenges[i].Game === ev.target.id || tempChallenges[i].Game === ev.target.value) {
        const tempGame = {...tempChallenges[i]};
        if ('checked' in ev.target ) {
          tempGame.show = ev.target.checked;
          tempChallenges.splice(i, 1);
          tempChallenges.splice(i, 0, tempGame);
        } else if (tempChallenges[i].Game === ev.target.value) {
          tempGame.show = true;
          tempChallenges.splice(i, 1);
          tempChallenges.splice(i, 0, tempGame);
        } else {
          tempGame.show = false;
        }
      } 
    }
    setChallenges([...tempChallenges]);
  };

  const getGames = async () => {
    const tempList = []; 
    const gameList = challenges;//(await axios.post('/challenge/list', {}, headers)).data.games;
    gameList.forEach(challenge => {
      for (let i = 0; i < user.decks.length; i++) {
        if (!tempList.includes(challenge.Game) && user.decks[i].code === `${challenge.Game}${parseInt(challenge.Deck)}`) {
          tempList.push(challenge.Game);
        }}
    });
    setDisplayGames(tempList);
  };

  useEffect(() => {
    axios.post('/challenge/list', {}, headers)
      .then(response => setChallenges(response.data.games));
  }, [user]);

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
    getGames();
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
          <button id="player-submit-btn" /*onKeyPress={(ev) => lookForEnter(ev)}*/ onClick={() => addUserName()}>+Player</button>
        </div>
      </div>
      <div id="multi-control">
        <label id="games-label">Your Games</label>
        <div id="scroller">
          <div id="multi-list">
            {displayGames.map((game, idx) => {
              return (<div key={idx} className="multi-list-item">
                <input className="multi-list-input" id={game} type="checkbox" onChange={ev => getChallenges(ev)}/>
                <div>{game}</div>
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