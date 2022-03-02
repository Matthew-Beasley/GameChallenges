import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';


const BottomBar = () => {

  return (
    <div id="bottombar-container">
      <p>
        <Link to='/terms'>Terms and Conditions</Link>  |  <Link to='/terms'>Privacy Policy</Link>  |  <Link to='/contact'>Contact Us</Link>  |  <Link to='/about'>About Us</Link>
      </p>
    </div>
  );
};

export default BottomBar;