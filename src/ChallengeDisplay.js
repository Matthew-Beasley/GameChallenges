import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameListState, challengesState, selectedTitlesState } from './RecoilState';
import NavBar from './NavBar';


const ChallengeDisplay = () => {
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [selectedTitles, setSelectedTitles] = useRecoilState(selectedTitlesState);

  useEffect(() => {
    //console.log('gameList in useEffect ', gameList)
    //console.log('selectedTitles in useEffect ', selectedTitles)
    const tempArr = [];
    console.log(gameList.length)
    for( let i = 0; i < gameList.length; i++) {
      if (selectedTitles.includes(gameList[i].Game) === true) {
        console.log('gameList[i].Game in if in loop ', gameList[i].Game)
        tempArr.push(gameList[i]);
      }
    }
    //console.log('challenges in useEffect ', tempArr)
    setChallenges([...tempArr]);
  }, [selectedTitles]);

  return (
    <div id="challenge-container"> 
      <div id="challenge-cards">
        {challenges.map((item, idx) => {
          return (
            <div key={idx}>{item.Game} {item.Challenge}</div>
          )
        })}
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