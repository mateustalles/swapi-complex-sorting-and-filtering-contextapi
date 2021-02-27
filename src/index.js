import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
import PlanetsDBProvider from './context/PlanetsDBContext';

ReactDOM.render(
  <PlanetsDBProvider>
    <App />
  </PlanetsDBProvider>, document.getElementById('root'),
);
