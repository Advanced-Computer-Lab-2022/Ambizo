import React from 'react';
import Homepage from '../components/Homepage/Homepage.js'
import AdminHomepage from '../components/AdminHomepage/AdminHomepage';
import InstructorHomepage from '../components/InstructorHomepage/InstructorHomepage.js';

function HomepageRoutes() {
    const[type, setType] = React.useState(sessionStorage.getItem("Type"));

    switch(type){
        case "admin": return <AdminHomepage />
        case "instructor": return <InstructorHomepage />
        default: return <Homepage />
    }

}

export default HomepageRoutes;
