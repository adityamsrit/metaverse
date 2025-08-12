// This is the entry point for your React application.
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You'll create this for basic Tailwind setup
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();