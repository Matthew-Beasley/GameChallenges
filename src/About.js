import React from 'react';
import NavBar from './NavBar';

const About = () => {
  return (
    <div id="about-container">
      <NavBar />
      <div id="about-plate">
        <img id="about-character" src="../assets/images/Characters-8.png" />
        <div id="about-definition">
          <h1>/THwôrt/</h1>
          <h2>verb</h2>
          <ol>
            <li>prevent (someone) from accomplishing something. "He never did anything to thwart his father"</li>
          </ol>
        </div>
        <p>We love gaming - we love our old games – we miss our old games.  But let’s face it.  We’ve played them out and they’ve lost their shine.</p>
        <p>So we found a way to bring them back.  We pulled them up and got creative. It’s a simple enough idea, really.  Just create challenges that have nothing to do with the original campaign.</p>
        <p>Your first deck is free.  It will contain 10 challenges for the game of your choice.  Each challenge will take anywhere from 5 – 20 minutes to complete, so it’s enough for an evening of fun.  After that, it’s just $1.99 for each deck.  Choose from over 20 different games now, with even more to be added soon.
        </p>
        <h3>Road Map:</h3>
        <p>The current game is very much a beta version, so any bugs can be submitted in the contact us page.</p>
        <p>The next steps are:</p>
        <ol>
          <li>We really want to focus on user feedback and bug fixes. It’s no fun playing a broken game.</li>
          <li>We will be constantly updating challenges, and adding more multi user challenges.</li>
          <li>Our next big feature will be to enable users to log into a Thwartme room where all the players can see the same game play page on their device.</li>
          <li>More animations and “cutesyness”!</li>
        </ol>
        <p>We are a very small team, but we are working hard to add cool features.</p>
        <p>Enjoy playing the game and be sure to check back to see new features as they come out!</p>
      </div>
    </div>
  );
};

export default About;