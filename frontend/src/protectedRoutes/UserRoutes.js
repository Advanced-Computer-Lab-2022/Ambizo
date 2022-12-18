import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

function UserRoutes() {
    const[loggedIn, setLoggedIn] = React.useState(sessionStorage.getItem("Type"));

    return loggedIn ? <Outlet /> : <Navigate to="/404" />;
}

export default UserRoutes;
