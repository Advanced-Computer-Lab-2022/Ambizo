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
import AddCourse from "./components/AddCourse/AddCourse";
import SearchPage from "./components/SearchPage/SearchPage";
import ExercisePage from './components/ExercisePage/ExercisePage';

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
                  <Route path='/search/:searchTerm' element={<SearchPage />} />
                  <Route path='/:mycourses/search/:searchTerm' element={sessionStorage.getItem("Type") === "instructor" ? <SearchPage /> : <Navigate to="/404" />} />
                  <Route path="/mycourses" element={sessionStorage.getItem("Type") === "instructor" ? <InstructorCoursesPage /> : <Navigate to="/404" />} />
                  <Route path="/addcourse" element={sessionStorage.getItem("Type") === "instructor" ? <AddCourse /> : <Navigate to="/404" />} />
                  <Route path="/addadmin" element={sessionStorage.getItem("Type") === "admin" ? <AddAdministrator /> : <Navigate to="/404" />} />
                  <Route path="/addtrainee" element={sessionStorage.getItem("Type") === "admin" ? <AddCorporateTrainee /> : <Navigate to="/404" />} />
                  <Route path="/addinstructor" element={sessionStorage.getItem("Type") === "admin" ? <AddInstructor />  : <Navigate to="/404" />} />
                  <Route path='/exercise/:courseId/:exerciseNum' element={<ExercisePage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    )
} 

export default App;