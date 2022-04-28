import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import {playersState} from './RecoilState'; 


const Player = ({player}) => {
  let itsMyTurn = '';
  player.MyTurn ? itsMyTurn = 'myturn' : itsMyTurn = '';
  return ( 
    <div id="player-container">
      <div className={`player ${itsMyTurn} ${player.Background}`} >
      </div>
      <div>{player.Score}</div>
    </div>
  );
};


const PlayerButtons = () => {
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
    <div id="playerbutton-container">
      {!!players.length && 
      <div id="playerbuttons">
        <button className="score-button" onClick={() => addPoint()}>+</button>
        <button className="score-button" onClick={() => failed()}>{'>'}</button>
      </div>}
    </div>
  );
};


const Players = () => {
  const [players, setPlayers] = useRecoilState(playersState);
  
  return (
    <div id="player-container">
      <div id="player-list">
        {players.map((player, idx) => {
          return (
            <Player player={player} key={idx} />
          );
        })} 
      </div>
      <div id="phone-playerline" />
    </div>
  );
};

export default Players;
export {
  PlayerButtons
};
