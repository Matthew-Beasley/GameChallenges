import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';

import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Black.ttf'; 
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Bold.ttf'; 
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-BoldItalic.ttf'; 
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-ExtraBold.ttf'; 
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Italic.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Light.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-LightItalic.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Medium.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-MediumItalic.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-Regular.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-SemiBold.ttf';
import '../assets/HKGrotesk2.41/TTF/HKGrotesk-SemiBoldItalic.ttf';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/styles/styles.css';

const root = document.querySelector('#root');

ReactDOM.render(
  <RecoilRoot><Router><App /></Router></RecoilRoot>,
  root
);