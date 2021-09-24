import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import localStorage from 'store/dist/store.legacy';
import { v4 as uuid } from 'uuid';

let tid = localStorage.get('tid');
if (!tid) {
  tid = uuid();
  localStorage.set('tid', tid);
}

fetch(`/api/t?tid=${tid}&rnd=${Math.floor(Math.random()*10000000)}`);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
