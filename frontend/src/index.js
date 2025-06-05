import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './firebase'; // Firebase 초기화
// import './index.css'; // index.css 파일이 있다면 주석 해제

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 