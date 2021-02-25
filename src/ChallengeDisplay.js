import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameListState, challengesState } from './RecoilState';
import NavBar from './NavBar';


const ChallengeDisplay = () => {
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);

  useEffect(() => {

  },[gameList]);

  return (
    <div id="challenge-container"> 
      <div id="challenge-cards">
        <p>game cards go here</p>
      </div>
    </div>
  );
};

const MobileChallenges = () => {
  return (
    <div id="mobilechallenges-nav">
      <NavBar />
      <div id="mobilechallenge-container">
        <div id="challenge-cards">
          <p>game cards go here</p>
        </div>
      </div>
    </div>
  );
};

export {
  ChallengeDisplay,
  MobileChallenges
};