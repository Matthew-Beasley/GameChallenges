import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

const ChallengeDisplay = () => {
  return (
    <div>
      <NavBar />
      <div id="challenge-container"> 
        <div id="challenge-cards">
          <p>game cards go here</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDisplay;