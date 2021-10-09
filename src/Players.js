import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import {playersState} from './RecoilState'; 


const Player = ({player}) => {
  let itsMyTurn = '';
  player.MyTurn ? itsMyTurn = 'myturn' : itsMyTurn = '';
  console.log(player.Background)
  return ( 
    <div className={`player ${itsMyTurn} ${player.Background}`} >
      <div>{player.Name}</div>
      <div>{player.Score}</div>
    </div>
  );
};

const Players = () => {
  const [players, setPlayers] = useRecoilState(playersState);

  const massageStateArray = (stateArray) => {
    const tmpArr = stateArray.map(item => {
      const tmpObj = {...item};
      return tmpObj;
    });
    return tmpArr;
  };

  const nextPlayer = (tmpArray) => {
    for (let i = 0; i < tmpArray.length; i++) {
      if (tmpArray[i].MyTurn === true) {
        tmpArray[i].MyTurn = false;

        if(tmpArray[i + 1] !== undefined) {
          tmpArray[i + 1].MyTurn = true;
          return tmpArray;
        } else {
          tmpArray[0].MyTurn = true;
          return tmpArray;
        }
      }
    }
  };

  const failed = () => {
    const massagedPlayers = massageStateArray(players);
    const incrementedPlayers = nextPlayer(massagedPlayers);
    setPlayers([...incrementedPlayers]);
  };

  const addPoint = () => {
    const tmpPlayers = massageStateArray(players);
    tmpPlayers.forEach(person => person.MyTurn ? ++person.Score : null);
    const incrementedPlayers = nextPlayer(tmpPlayers);
    setPlayers([...incrementedPlayers]);
  };
  
  return (
    <div id="player-container">
      <div id="player-list">
        {console.log('players list: ', players)}
        {players.map((player, idx) => {
          return (
            <Player player={player} key={idx} />
          );
        })} 
      </div>
      {!!players.length && <div id="player-buttons">
        <button className="score-button" onClick={() => addPoint()}>Succeeded!</button>
        <button className="score-button" onClick={() => failed()}>Sorry, failed</button>
      </div>}
    </div>

  );
};

export default Players;
