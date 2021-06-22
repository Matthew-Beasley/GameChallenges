import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { HashRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/styles/styles.css';
import '../assets/styles/landingpage.css';
import '../assets/styles/products.css';

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