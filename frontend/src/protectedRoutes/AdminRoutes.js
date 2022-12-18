import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

function AdminRoutes() {
    const[admin, setAdmin] = React.useState(sessionStorage.getItem("Type") === "admin"? true : null);
    
    return admin ? <Outlet /> : <Navigate to="/404" />;
}

export default AdminRoutes;
