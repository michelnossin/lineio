'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import LineIO from './components/LineIO';
import LineHistory from './components/LineHistory';

ReactDOM.render(
  <div>
  <LineHistory />
  <LineIO />
  </div>,
  document.getElementById('app')
);
