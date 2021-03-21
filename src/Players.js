import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {playersState} from './RecoilState'; 

const Player = ({player}) => {
  const [itsMyTurn, setItsMyTurn] = useState('');
  //console.log('player in Player ', player);
  return ( 
    <div className={`player ${itsMyTurn}`}>
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
     // console.log(tmpArray[i], tmpArray.length)
      if (tmpArray[i].MyTurn === true && i < tmpArray.length && tmpArray[++i] !== undefined) {
        tmpArray[i].MyTurn = false;
        tmpArray[++i].MyTurn = true;
        return tmpArray;
      } else if (tmpArray[i].MyTurn === true && i === tmpArray[++i] === undefined) {
        tmpArray[i].MyTurn = false;
        tmpArray[0].MyTurn = true;
        return tmpArray;
      }
    }
  };

  const failed = () => {
    const massagedPlayers = massageStateArray(players);
    const incrementedPlayers = nextPlayer(massagedPlayers);
    setPlayers([...incrementedPlayers]);
  };

  const addPoint = () => {
    console.log(players.length)
    const tmpPlayers = massageStateArray(players);
    console.log(tmpPlayers.length)
    tmpPlayers.forEach(person => person.MyTurn ? ++person.Score : null);
    const incrementedPlayers = nextPlayer(tmpPlayers);
    setPlayers([...incrementedPlayers]);
  };
  
  return (
    <div id="player-container">
      <div id="player-list">
        {players.map((player, idx) => {
          return (
            <Player player={player} key={idx} />
          );
        })} 
      </div>
      <div id="player-buttons">
        <button className="score-button" onClick={() => addPoint()}>Succeeded!</button>
        <button className="score-button" onClick={() => failed()}>Sorry :(</button>
      </div>
    </div>

  );
};

export default Players;
