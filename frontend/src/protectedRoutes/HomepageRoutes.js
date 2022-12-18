import React from 'react';
import Homepage from '../components/Homepage/Homepage.js'
import AdminHomepage from '../components/AdminHomepage/AdminHomepage';

function HomepageRoutes() {
    const[type, setType] = React.useState(sessionStorage.getItem("Type"));

    switch(type){
        case "admin": return <AdminHomepage />
        default: return <Homepage />
    }

}

export default HomepageRoutes;
