import React from 'react';
import Header from "./components/Header/Header.component";
import Homepage from "./components/Home/Homepage.component";
import Contactpage from "./components/Contact/Contactpage.component";
import NotFound from "./components/404/NotFound.component";
import Footer from "./components/Footer/Footer.component";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path='*' element={<Navigate to="/404" />} />
                    <Route path='/404' element={<NotFound />} />
                    <Route path="/" element={<Homepage />} />
                    <Route path="/contact" element={<Contactpage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App;