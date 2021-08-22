import React from 'react';
import NavBar from './NavBar';

const About = () => {
  return (
    <div id="about-container">
      <NavBar />
      <div id="about-plate">
        <img id="about-character" src="../assets/images/Characters-08.png" />
        <h2>Challenge your friends to ridiculous stunts in games you already have!</h2>
        <h3>About Us</h3>
        <div id="about-definition">
          <h3>thwart</h3>
          <h1>/THwôrt/</h1>
          <h2>verb</h2>
          <ol>
            <li>prevent (someone) from accomplishing something. "He never did anything to thwart his father"</li>
          </ol>
        </div>
        <p>We love gaming - we love our old games – we miss our old games.  But let’s face it.  We’ve played them out and they’ve lost their shine.</p>
        <p>So we found a way to bring them back.  We pulled them up and got creative. It’s a simple enough idea, really.  Just create challenges that have nothing to do with the original campaign.</p>
        <p>But we took it to the next level.  We’ve created challenges – lots of challenges – for lots of games.  And there’s more coming all the time. 
          You can even join in the fun and contribute your own!  If we use your challenge, you’ll get a free pack – the one that your challenge appears in.  That way you can see how your friends measure up to your challenge!
          Your first pack is free.  It will contain 10 challenges for the game of your choice.  Each challenge will take anywhere from 5 – 20 minutes to complete, so it’s enough for an evening 
        </p>
      </div>
    </div>
  );
};

export default About;