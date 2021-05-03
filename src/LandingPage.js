import React, { useEffect, useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Login from './Login';
import NavBar from './NavBar';


const LandingPage = () => {
  const history = useHistory();

  return (
    <div id="landingpage">
      <NavBar />
     
      <div id="landingpage-wrapper">
        <div id="landingpage-image">
          <div id="signup" >
            <div id="bubble">
              <img src="../assets/images/SignupNow-small.png" />
            </div>
            <div id="signup-text" onClick={() => history.push('/login')}>
              <div>Sign Up Now!</div>
              <div>Play For Free!</div>
            </div>
          </div>
          <img src="../assets/images/GameOn-small.png" />
          {/*<div id="table"></div>*/}
        </div>
        <div id="landingpage-text">
          <div id="thwartme-header">Thwart Me!</div>
          <div className="landingpage-header" >Challenge your friends to ridiculous stunts in games you already have!</div>
          <div className="landingpage-header" >Never play the objective again:</div>
          <ol>
            <li>Gather your gaming friends.</li>
            <li>Pull out all those games that you loved but have played out.</li>
            <li>Start a round of “Thwart Me!”</li>
          </ol>
          <p>
          You’ll find new ways to love your games all over again, as you attempt crazy 
          challenges that have nothing to do with how the game was meant to be played.  
          Whether it’s an unconventional race or a treasure hunt, you’ll laugh your 
          way through an epic fail or<br/> ultimate victory.
          </p>
          <button onClick={() => history.push('/readmore')}>Read More</button>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;