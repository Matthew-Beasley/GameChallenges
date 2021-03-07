import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
//import css from'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { challengesState } from './RecoilState';
import NavBar from './NavBar';


const ChallengeDisplay = () => {
  const [challenges, setChallenges] = useRecoilState(challengesState);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
  };

  return (
    <div id="outer-challenges-display">
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
        </div>
      </div>
      <div id="mobilechallenges-nav">
        <NavBar />
        <div id="mobilechallenge-container">
          <div id="challenge-cards">
            <Slider {...settings}>
              {challenges.map((item, idx) => {
                if (item.show) {
                  return (
                    <div key={idx}>{item.Game} {item.Challenge}</div>
                  );}
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;