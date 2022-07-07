import React from 'react';
import NavBar from './NavBar';

const About = () => {
  return (
    <div id="about-container">
      <div id="about-plate">
        <img id="about-character" src="../assets/images/Characters-8.png" />
        <div id="about-definition">
          <h3>/THwôrt/</h3>
          <h4>verb</h4>
          <ol>
            <li>prevent (someone) from accomplishing something. "He never did anything to thwart his father"</li>
          </ol>
        </div>
        <p>We love gaming - we love our old games – we miss our old games.  But let’s face it.  We’ve played them out and they’ve lost their shine.</p>
        <p>So we found a way to bring them back.  We pulled them up and got creative. It’s a simple enough idea, really.  Just create challenges that have nothing to do with the original campaign.</p>
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