import React, { useEffect, useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Login from './Login';
import NavBar from './NavBar';


const LandingPage = () => {

  return (
    <div id="landingpage">
      <NavBar />
      <div id="characters">
        <div id="icecream" className="character">
          <img src="./assets/images/icecream.png"  />
        </div>
        <div id="milkshake" className="character">

        </div>
        <div id="chocolatebar" className="character">

        </div>
        <div id="tea" className="character">

        </div>
        <div id="cake" className="character">

        </div>
        <div is="textpanel" className="character">

        </div>
        <div id="olives" className="character">

        </div>
        <div id="candy" className="character">

        </div>
        <div id="toast"  className="character">

        </div>
      </div>      
    </div>
  );
};

export default LandingPage;