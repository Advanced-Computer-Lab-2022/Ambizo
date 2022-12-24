import React from 'react';
import Homepage from '../components/Homepage/Homepage.js'
import AdminHomepage from '../components/AdminHomepage/AdminHomepage';
import InstructorHomepage from '../components/InstructorHomepage/InstructorHomepage';
import TraineeHomepage from '../components/TraineeHomepage/TraineeHomepage';

function HomepageRoutes() {
    const[type, setType] = React.useState(sessionStorage.getItem("Type"));

    switch(type){
        case "admin": return <AdminHomepage />
        case "instructor": return <InstructorHomepage />
        case "individualTrainee": case "corporateTrainee": return <TraineeHomepage />
        default: return <Homepage />
    }

}

export default HomepageRoutes;