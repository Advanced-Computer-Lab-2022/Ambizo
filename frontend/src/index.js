import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import App from './App';
import CoursesPage from './components/CoursesPage/CoursesPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<CoursesPage />} />
    </Routes>
  </Router>
);

reportWebVitals();
