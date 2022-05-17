import React from 'react';
import ReactDOM from 'react-dom';
import localStorage from 'store/dist/store.legacy';
import { ReplaySync } from './replay-sync';

ReactDOM.render(
  <React.StrictMode>
    <ReplaySync
      statsMode={document.location.hash === '#stats'}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
