'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import LineIO from './components/LineIO';
import LineHistory from './components/LineHistory';

//By splitting realtime lines, and the cumulative hitory of lines we prevent history of being refreshed 50 times per second.
//Also we split history per slot, to prevent the whole game to be rendered after each keypress of any user.
ReactDOM.render(
  <div>
  <LineHistory slot="0"/>
  <LineHistory slot="1"/>
  <LineHistory slot="2"/>
  <LineHistory slot="3"/>
  <LineHistory slot="4"/>
  <LineHistory slot="5"/>
  <LineHistory slot="6"/>
  <LineHistory slot="7"/>
  <LineHistory slot="8"/>
  <LineHistory slot="9"/>
  <LineHistory slot="10"/>
  <LineHistory slot="11"/>
  <LineHistory slot="12"/>
  <LineHistory slot="13"/>
  <LineHistory slot="14"/>
  <LineHistory slot="15"/>
  <LineIO />
  </div>,
  document.getElementById('app')
);
