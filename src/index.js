import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';

const root = document.querySelector('#root');

ReactDOM.render(
  <RecoilRoot><Router><App /></Router></RecoilRoot>,
  root
)