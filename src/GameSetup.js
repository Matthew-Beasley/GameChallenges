import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playerListState } from './RecoilState';

const GameSetup = () => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useRecoilState(playerListState);
  const [splitScreen, setSplitScreen] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
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
    console.log('queryObj in findGames ', queryObj)
    const games = await axios.get('/challenge', { params: queryObj });
    console.log('games in find games after axios ', games.data);
  };

  return (
    <div id="gamesetup-container">
      <div id="players">
        <label>Players</label>
        <input id="player-input" tyupe="text" value={playerName} onChange={ev => setPlayerName(ev.target.value)} />
        <button onClick={ setPlayers( playerName )}>Add Player</button>
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
        <label>Split screen only</label>
        <input type="checkbox" onChange={ev => setSplitScreen(ev.target.value)} />
        <label>Kid friendly</label>
        <input type="checkbox" onChange={ev => setKidFriendly(ev.target.value)} />
      </div>
      <div id="online">
        <label>Online only</label>
        <select>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Online and Offline</option>
        </select>
      </div>
      <div id="time-limit">
        <label>Time Limit in minutes</label>
        <input type="text" />
      </div>
      <div id="games">
        <button onClick={() => findGames()} >Find Games</button>
        <label>Games</label>
        
      </div>
    </div>
  );
};

export default GameSetup;