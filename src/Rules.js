import React from 'react';
import NavBar from './NavBar';
import BottomBar from './BottomBar';
import Video from './Video';

const Rules = () => {
  return (
    <div id="rules-container">
      <NavBar />
      <div id="rulesvideo-container">
        <div id="rules-plate">
          <h1>How to Play</h1>  
          <p>Welcome to Thwart Me!</p> 
          <p>We have some basic rules (more “guidelines,” really) to help you get started, but this game is designed to provide you with ample opportunities for “house rules.”</p>
          <p>First, decide which device and user is going to run the game.  Everyone’s scores will be entered in the one place.</p> 
          <p>Start by creating a user and logging in.</p>
          <p>Next, to get the party started, you’ll need to choose a deck (or decks) to play.  The first deck is free.  After that, they’re $1.99/deck.  The list of available choices is always growing!</p>
          <p>Once you’re in the game, enter each player’s name, and choose any filters to narrow down which of your decks you want to play.  Your first challenge will be displayed.  You’ll know whose turn it is because their avatar in the navigation bar will be elevated.  When the challenge is over, the player enters whether or not they were successful.  The score will appear on the scoreboard and then the next player’s avatar will jump up.</p>
        </div>
        <Video />
      </div>
      <BottomBar />
    </div>
  );
};

export default Rules;