import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
//import css from'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { gameListState, challengesState, selectedTitlesState } from './RecoilState';
import NavBar from './NavBar';

/* ===== Do I want to move duplicated variables and functions out of components into the global state? ===== */


const ChallengeDisplay = () => {
  const [gameList, setGameList] = useRecoilState(gameListState);
  const [challenges, setChallenges] = useRecoilState(challengesState);
  const [selectedTitles, setSelectedTitles] = useRecoilState(selectedTitlesState);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

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
    <div id="outer-challenges-display">
      <div id="challenge-container"> 
        <div id="challenge-cards">
          <Slider {...settings}>
            {challenges.map((item, idx) => {
              return (
                <div key={idx}>{item.Game} {item.Challenge}</div>
              );
            })}
          </Slider>
        </div>
      </div>
      <div id="mobilechallenges-nav">
        <NavBar />
        <div id="mobilechallenge-container">
          <div id="challenge-cards">
            <Slider {...settings}>
              {challenges.map((item, idx) => {
                return (
                  <div key={idx}>{item.Game} {item.Challenge}</div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;