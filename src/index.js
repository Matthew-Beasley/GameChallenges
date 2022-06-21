import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { HashRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/styles/styles.css';
import '../assets/styles/landingpage.css';
import '../assets/styles/products.css';
import '../assets/styles/aboutus.css';
import '../assets/styles/contactus.css';
import '../assets/styles/game.css';
import '../assets/styles/login.css';
import '../assets/styles/createUser.css';
import '../assets/styles/nav.css';
import '../assets/styles/terms.css';

const root = document.querySelector('#root');

ReactDOM.render(
  <RecoilRoot>
    <Router>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Router>
  </RecoilRoot>,
  root
);