import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/404/NotFound";
import CoursesPage from './components/CoursesPage/CoursesPage';
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                  <Route path='*' element={<Navigate to="/404" />} />
                  <Route path='/404' element={<NotFound />} />
                  <Route path="/" element={<CoursesPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App;