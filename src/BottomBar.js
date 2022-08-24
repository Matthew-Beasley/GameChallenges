import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';


const BottomBar = () => {

  return (
    <div id="bottombar-container">
      <p>
        <Link to='/terms'>Terms and Conditions</Link>  |  <Link to='/aboutcontact'>Contact Us</Link>  |  <Link to='/aboutcontact'>About Us</Link>  |  <a href="https://discord.gg/tdyGFH6dwu" target="_blank" rel="noopener noreferrer">Discord Channel</a>
      </p>
    </div>
  );
};

export default BottomBar;