import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';

const Contact = () => {
  return (
    <div id="contactpage">
      <NavBar />
      <div id="contact-image">
        <img src="../assets/images/GameOn-small.png" />
      </div>
      <div id="contact-text">
        <div id="contact-thwartme-header">Thwart Me!</div>
        <div className="contact-header" >Challenge your friends to ridiculous stunts in games you already have!</div>
        <div className="contact-header" >Never play the objective again:</div>
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
        <button onClick={() => history.push('/ReadMore')}>Read More</button>
      </div>
      <div id="contact-signup" >
        <div id="contact-bubble">
          <img src="../assets/images/SignupNow-small.png" />
        </div>
        <div id="contactsignup-text" onClick={() => history.push('/Shopping')}>
          <div>Sign Up Now!</div>
          <div>Play For Free!</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;