import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameListState, challengesState, selectedTitlesState } from './RecoilState';
import NavBar from './NavBar';

/* ===== Do I want to move duplicated variables and functions out of components into the global state? ===== */

const ChallengeDisplay = () => {
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [selectedTitles, setSelectedTitles] = useRecoilState(selectedTitlesState);

  useEffect(() => {
    const tempArr = [];
    for( let i = 0; i < gameList.length; i++) {
      if (selectedTitles.includes(gameList[i].Game) === true) {
        tempArr.push(gameList[i]);
      }
    }
    setChallenges([...tempArr]);
  }, [selectedTitles]);

  return (
    <div id="challenge-container"> 
      <div id="challenge-cards">
        {challenges.map((item, idx) => {
          return (
            <div key={idx}>{item.Game} {item.Challenge}</div>
          );
        })}
      </div>
    </div>
  );
};

const MobileChallenges = () => {
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [selectedTitles, setSelectedTitles] = useRecoilState(selectedTitlesState);

  useEffect(() => {
    const tempArr = [];
    for( let i = 0; i < gameList.length; i++) {
      if (selectedTitles.includes(gameList[i].Game) === true) {
        tempArr.push(gameList[i]);
      }
    }
    setChallenges([...tempArr]);
  }, [selectedTitles]);

  return (
    <div id="mobilechallenges-nav">
      <NavBar />
      <div id="mobilechallenge-container">
        <div id="challenge-cards">
          {challenges.map((item, idx) => {
            return (
              <div key={idx}>{item.Game} {item.Challenge}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export {
  ChallengeDisplay,
  MobileChallenges
};