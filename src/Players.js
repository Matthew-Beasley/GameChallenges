import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {playersState} from './RecoilState'; 

const Players = () => {
  const [players, setPlayers] = useRecoilState(playersState);
  
  return (
    <div id="player-list">
      {players.map((player, idx) => {
        return ( 
          <div key={idx} className="player">
            <div>{player}</div>
          </div>
        );
      })} 
    </div>
  );
};

export default Players;
