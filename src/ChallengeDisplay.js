import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Slider from 'react-slick';
import { challengesState } from './RecoilState';
import NavBar from './NavBar';
import Players from './Players';


const ChallengeDisplay = () => {
  const [challenges, setChallenges] = useRecoilState(challengesState);

  useEffect(() => {
    setChallenges([...challenges]);
  }, []);

  useEffect(() => {
    console.log('challenges in challengDisplay changed', challenges)
  }, [challenges]); 

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

  return (
    <div id="outer-challenges-display">
      <NavBar />
      <div id="challenge-container"> 
        <div id="challenge-cards">
          <Slider {...settings}>
            {challenges.map((item, idx) => { 
              if (item.show) {
                return (
                  <div className="challenge-text" key={idx}>
                    <div className="challenge-title">{item.Game}</div>
                    <div className="challenge-rules">{item.Challenge}</div>
                    {!!item.TimeLimit && <div className="challenge-time">{`Time Limit: ${item.TimeLimit}`}</div>}
                  </div>
                );}
            })}
          </Slider>
          <img id="kitchencounter" src="../assets/images/kitchencounter.png" />
        </div>
        
      </div>
      <div className="mobilechallenge-container">
        <Players />
        <div id="mobilechallenge-cards">
          <Slider {...settings}>
            {challenges.map((item, idx) => {
              if (item.show) {
                return (
                  <div className="mobilechallenge-text" key={idx}>
                    <div className="challenge-title">{item.Game}</div>
                    <div className="challenge-rules">{item.Challenge}</div>
                    {!!item.TimeLimit && <div className="challenge-time">{`Time Limit: ${item.TimeLimit}`}</div>}
                  </div>
                );}
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;