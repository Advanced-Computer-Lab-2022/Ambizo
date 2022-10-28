import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/404/NotFound";
import CoursesPage from './components/CoursesPage/CoursesPage';
import InstructorPage from './components/InstructorPage/InstructorPage';
import Footer from "./components/Footer/Footer";
import AddAdministrator from "./components/AddAdministrator/AddAdministrator";
import AddCorporateTrainee from "./components/AddCorporateTrainee/AddCorporateTrainee";
import AddInstructor from "./components/AddInstructor/AddInstructor";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                  <Route path='*' element={<Navigate to="/404" />} />
                  <Route path='/404' element={<NotFound />} />
                  <Route path="/" element={<CoursesPage />} />
                  <Route path="/mycourses" element={<InstructorPage />} />
                  <Route path="/addadmin" element={<AddAdministrator />} />
                  <Route path="/addtrainee" element={<AddCorporateTrainee />} />
                  <Route path="/addinstructor" element={<AddInstructor />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
}

export default App;