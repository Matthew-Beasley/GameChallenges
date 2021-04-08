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
        <div id="text1">

        </div>
        <div id="text2">
          
        </div>
      </div>      
    </div>
  );
};

export default LandingPage;