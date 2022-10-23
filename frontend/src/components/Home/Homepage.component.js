import React, {useEffect} from "react";
import CorporateTraineeService from "../../services/CorporateTrainee.service";

async function retrieveAllCorporateTrainees(){
    const response = await CorporateTraineeService.getAllTrainees();
    console.log(response.data);
}

function Homepage() {

    useEffect(() => {
        document.title = "Homepage";
        retrieveAllCorporateTrainees();
    }, []);

    return (
        <div>
            <h1> Hello Home </h1>
        </div>
    )
}

export default Homepage;