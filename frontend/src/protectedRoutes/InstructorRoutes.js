import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

function InstructorRoutes() {
    const[instructor, setInstructor] = React.useState(sessionStorage.getItem("Type") === "instructor"? true : null);

    return instructor ? <Outlet /> : <Navigate to="/404" />;
}

export default InstructorRoutes;
