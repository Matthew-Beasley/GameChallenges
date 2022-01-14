import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Slider from 'react-slick';
import { challengesState } from './RecoilState';
import NavBar from './NavBar';
import Players, {PlayerButtons} from './Players';


const ChallengeDisplay = () => {
  const [challenges, setChallenges] = useRecoilState(challengesState);

  useEffect(() => {
    setChallenges([...challenges]);
  }, []);

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
                    {!!item.Attempts && <div className="challenge-attempts">{`Attempts: ${item.Attempts}`}</div>}
                    <div className="challenge-rules">Suggested number of players {item.Players}</div>
                  </div>
                );}
            })}
          </Slider>
          <img id="kitchencounter" src="../assets/images/kitchencounter.png" />
        </div> 
      </div>
      <div className="mobilechallenge-container">
        <Players />
        <PlayerButtons />
        <div id="mobilebackground">
          <div id="mobilechallenge-cards">
            <Slider {...settings}>
              {challenges.map((item, idx) => {
                if (item.show) {
                  return (
                    <div className="mobilechallenge-text" key={idx}>
                      <div className="challenge-title">{item.Game}</div>
                      <div className="challenge-rules">{item.Challenge}</div>
                      {!!item.TimeLimit && <div className="challenge-time">{`Time Limit: ${item.TimeLimit}`}</div>}
                      <div className="challenge-rules">Number of players {item.Players}</div>
                    </div>
                  );}
              })}
            </Slider>
          </div>
          <img id="kitchencounter" src="../assets/images/kitchencounter.png" />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;