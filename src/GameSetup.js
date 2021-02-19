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
        <input id="player-input" tyupe="text" value={playerName} onChange={ev => setPlayerName(ev.target.value)} />
      </div>
      <div id="platforms">
        <label>Platforms</label>
        <select>
          <option value="PC">PC</option>
          <option value="Xbox">Xbox</option>
          <option value="PS">Play Station</option>
          <option value="Switch">Switch</option>
          <option value="mobile">Mobile</option>
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
        <select>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Online and Offline</option>
        </select>
      </div>
      <div id="timelimit">
        <label>Time Limit</label>
        <input type="text" />
      </div>
      <div id="findgames">
        <button onClick={() => findGames()} >Find Games</button>
      </div>
      <div id="games">
        <label>Games</label>
        <div id="scroller">
          <ul id="games-list">
            {gameList.map((game, idx) => {
              return (<li key={idx}><input type="checkbox" />{game}</li>);
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;