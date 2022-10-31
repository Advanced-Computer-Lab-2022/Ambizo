import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/404/NotFound";
import CoursesPage from './components/CoursesPage/CoursesPage';
import CourseDetailsPage from './components/CourseDetailsPage/CourseDetailsPage';
import InstructorCoursesPage from './components/InstructorCoursesPage/InstructorCoursesPage';
import Footer from "./components/Footer/Footer";
import AddAdministrator from "./components/AddAdministrator/AddAdministrator";
import AddCorporateTrainee from "./components/AddCorporateTrainee/AddCorporateTrainee";
import AddInstructor from "./components/AddInstructor/AddInstructor";
import LoginPage from "./components/LoginPage/LoginPage";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                  <Route path='*' element={<Navigate to="/404" />} />
                  <Route path='/404' element={<NotFound />} />
                  <Route path="/" element={<CoursesPage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/coursedetails/:courseId' element={<CourseDetailsPage />} />
                  <Route path="/mycourses" element={sessionStorage.getItem("Type") === "instructor" ? <InstructorCoursesPage /> : <Navigate to="/404" />} />
                  <Route path="/addadmin" element={sessionStorage.getItem("Type") === "admin" ? <AddAdministrator /> : <Navigate to="/404" />} />
                  <Route path="/addtrainee" element={sessionStorage.getItem("Type") === "admin" ? <AddCorporateTrainee /> : <Navigate to="/404" />} />
                  <Route path="/addinstructor" element={sessionStorage.getItem("Type") === "admin" ? <AddInstructor />  : <Navigate to="/404" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
} 

export default App;