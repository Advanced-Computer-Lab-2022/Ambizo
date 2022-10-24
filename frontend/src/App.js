// import React from 'react';
// import Header from "./components/Header/Header.component";
// import Homepage from "./components/Home/Homepage.component";
// import Contactpage from "./components/Contact/Contactpage.component";
// import NotFound from "./components/404/NotFound.component";
// import Footer from "./components/Footer/Footer.component";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// function App() {
//     return (
//         <Router>
//             <div>
//                 <Header />
//                 <Routes>
//                     <Route path='*' element={<Navigate to="/404" />} />
//                     <Route path='/404' element={<NotFound />} />
//                     <Route path="/" element={<Homepage />} />
//                     <Route path="/contact" element={<Contactpage />} />
//                 </Routes>
//                 <Footer />
//             </div>
//         </Router>
//     )
// }

// export default App;

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
