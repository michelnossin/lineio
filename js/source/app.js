'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import LineIO from './components/LineIO';
import LineHistory from './components/LineHistory';

//By splitting realtime lines, and the cumulative hitory of lines we prevent history of being refreshed 50 times per second.
//Also we split history per slot, and per split , which covers a quator of the windows.
//to prevent the whole game to be rendered after each keypress of any user.
ReactDOM.render(
  <div>
  <LineHistory slot="0" split="0"/>
  <LineHistory slot="0" split="1"/>
  <LineHistory slot="0" split="2"/>
  <LineHistory slot="0" split="3"/>
  <LineHistory slot="1" split="0"/>
  <LineHistory slot="1" split="1"/>
  <LineHistory slot="1" split="2"/>
  <LineHistory slot="1" split="3"/>
  <LineHistory slot="2" split="0"/>
  <LineHistory slot="2" split="1"/>
  <LineHistory slot="2" split="2"/>
  <LineHistory slot="2" split="3"/>
  <LineHistory slot="3" split="0"/>
  <LineHistory slot="3" split="1"/>
  <LineHistory slot="3" split="2"/>
  <LineHistory slot="3" split="3"/>
  <LineIO />
  </div>,
  document.getElementById('app')
);
