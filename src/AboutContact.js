import React from 'react';
import About from './About';
import Contact from './Contact';
import NavBar from './NavBar';
import BottomBar from './BottomBar';

const AboutContact = () => {

  return (
    <div id="aboutcontact">
      <NavBar />
      <div id="aboutcontactrow">
        <About />
        <Contact />
      </div>
      <div id="aboutcontactbuffer" />
      <BottomBar />
    </div>
  );
};

export default AboutContact;