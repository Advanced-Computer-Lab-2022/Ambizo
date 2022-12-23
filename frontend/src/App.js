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
import RequestPasswordResetPage from './components/RequestPasswordResetPage/RequestPasswordResetPage';
import PasswordResetPage from './components/PasswordResetPage/PasswordResetPage';
import AddExercise from './components/AddExercise/AddExercise';
import UserProfile from './components/UserProfile/UserProfile';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import SettingsPage from './components/SettingsPage/SettingsPage';
import DiscountPage from './components/DiscountPage/DiscountPage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import AdminSetPromotion from './components/AdminSetPromotion/AdminSetPromotion';
import AdminRoutes from "./protectedRoutes/AdminRoutes";
import HomepageRoutes from "./protectedRoutes/HomepageRoutes";
import InstructorRoutes from "./protectedRoutes/InstructorRoutes";
import UserRoutes from "./protectedRoutes/UserRoutes";
import CoursesAccessRequests from './components/CoursesAccessRequests/CoursesAccessRequests';
import ReportsPage from './components/ReportsPage/ReportsPage';

function App() {

    return (
        <Router>
            <>
                <Routes>
                    <Route path='*' element={<Navigate to="/404" />} />
                    <Route path='/404' element={<NotFound />} />
                    <Route path='/allcourses' element={<CoursesPage />} />
                    <Route path='/coursedetails/:courseId' element={<CourseDetailsPage />} />
                    <Route path='/search/:searchTerm' element={<SearchPage />} />
                    <Route path='/requestPasswordReset' element={<RequestPasswordResetPage />} />
                    <Route path='/resetPassword/:resetToken' element={<PasswordResetPage />} />
                    <Route path='/user/:username' element={<UserProfile />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signUp' element={<SignUpPage />} />

                    <Route path="/" element={<HomepageRoutes />} />

                    <Route path="/" element={<AdminRoutes />}>
                        <Route path="/addadmin" element={ <AddAdministrator /> } />
                        <Route path="/addtrainee" element={ <AddCorporateTrainee /> } />
                        <Route path="/addinstructor" element={ <AddInstructor /> } />
                        <Route path='/pricesanddiscounts' element={<AdminSetPromotion />} />
                        <Route path='/courseaccessrequests' element={<CoursesAccessRequests />} />
                    </Route>

                    <Route path="/" element={<InstructorRoutes />}>
                        <Route path="/mycourses" element={<InstructorCoursesPage />} />
                        <Route path="/addcourse" element={<AddCourse />} />
                        <Route path='/addExercise/:courseId/:exerciseNum' element={<AddExercise /> } />
                        <Route path='/:mycourses/search/:searchTerm' element={<SearchPage />} />
                        <Route path='/definediscount/:courseId' element={<DiscountPage />} />
                    </Route>

                    <Route path="/" element={<UserRoutes />}>
                        <Route path='/exercise/:courseId/:exerciseNum' element={<ExercisePage />} />
                        <Route path='/settings' element={<SettingsPage />} />
                        <Route path='/allreports' element={<ReportsPage />} />
                    </Route>
                    
                </Routes>
                <Footer />
                <ScrollToTopButton />
            </>
        </Router>
    )
} 

export default App;