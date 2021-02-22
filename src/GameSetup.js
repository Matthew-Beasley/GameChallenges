import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playerListState } from './RecoilState';

const GameSetup = () => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useRecoilState(playerListState);
  const [splitScreen, setSplitScreen] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [gameList, setGameList] = useState(['game1', 'game2', 'game3', 'game4', 'game5', 'game6', 'game7', 'game8', 'game9', 'game10','game1', 'game2', 'game3', 'game4', 'game5', 'game6', 'game7', 'game8', 'game9', 'game10']);
  let queryString = '';
  const platforms = ['PC', 'Xbox', 'Playstation',	'Switch', 'Mobile'];
  /*
  useEffect(() => {
    //query for all platforms in challenges 
  }, []);
*/

  const findGames = async () => {
    const queryObj = {
      PC: true,
      Game: 'Grand Theft Auto V'
    };
    console.log('queryObj in findGames ', queryObj);
    const games = await axios.get('/challenge', { params: queryObj });
    console.log('games in find games after axios ', games.data);
  };

  return (
    <div id="gamesetup-container">
      <div id="players">
        <label>Players</label>
        <input id="player-input" type="text" value={playerName} placeholder="enter player name" onChange={ev => setPlayerName(ev.target.value)} />
      </div>
      <div id="platform-control">
        <label>Platforms</label>
        <div id="scroller">
          <div id="platform-list">
            {platforms.map((game, idx) => {
              return (<div key={idx} className="platform-list-item"><input className="platform-list-input" type="checkbox" />{game}</div>);
            })}
          </div>
        </div>
      </div>
      <div id="phone-platformselect">
        <label>Platforms</label>
        <select multiple>
          {platforms.map((game, idx) => {
            return (<option key={idx}>{game}</option>);
          })}
        </select>
      </div>
      <div id="checkboxes">
        <label id="splitscreen-label">Split screen only</label>
        <input id="splitscreen-chk" type="checkbox" onChange={ev => setSplitScreen(ev.target.value)} />
        <label id="kids-label">Kid friendly</label>
        <input id="kids-chk" type="checkbox" onChange={ev => setKidFriendly(ev.target.value)} />
      </div>
      <div id="online">
        <label>Online only</label>
        <select multiple >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Online and Offline</option>
        </select>
      </div>
      <div id="timelimit">
        <label>Time Limit</label>
        <select multiple>
          <option value="all">All</option>
          <option value="5orless">5 or Less</option>
          <option value="15orless">15 or Less</option>
          <option value="over-15">Over 15</option>
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
              return (<div key={idx} className="multi-list-item"><input className="multi-list-input" type="checkbox" />{game}</div>);
            })}
          </div>
        </div>
      </div>
      <div id="phone-gameselect">
        <label>Games</label>
        <select multiple>
          {gameList.map((game, idx) => {
            return (<option key={idx}>{game}</option>);
          })}
        </select>
      </div>
    </div>
  );
};

export default GameSetup;