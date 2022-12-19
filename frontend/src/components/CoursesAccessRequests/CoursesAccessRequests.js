import React from "react"
import Header from "../Header/Header"
import AccessRequestsImage from "../../images/AccessRequestImage.svg"
import AccessRequest from "../AccessRequest/AccessRequest"
import AdministratorService from "../../services/Administrator.service";

async function retrieveAllAccessRequests(setIsLoading){
    setIsLoading(true);
    return AdministratorService.getAllAccessRequests()
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

function CourseAccessRequests() {

    const [isLoading, setIsLoading] = React.useState(false);
    const [accessRequestsData, setAccessRequestsData] = React.useState([])

    React.useEffect(() => {
        retrieveAllAccessRequests(setIsLoading)
        .then((requestsList) => {
            setAccessRequestsData(requestsList.data)
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    const accessRequestsElements = accessRequestsData.map((request) => {
        return (
            <AccessRequest
                key={request._id}
                setIsLoading={setIsLoading}
                {...request}
            />
        )
    }) 

    return (
        <>
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading ? 
                (
                    <> 
                        <Header />
                    </>
                ) 
                : 
                (
                    <>
                        <Header />
                        <div className="accessrequests--headerdiv">
                            <h1 className="accessrequests--header">Courses Access Requests</h1>
                            <img className="accessrequests--pricesimage" src={AccessRequestsImage} alt='Access Requests' />
                        </div>
                        <div className="accessrequests--number">
                            <h2>{accessRequestsData.length} {accessRequestsData.length === 1 ? "Pending Request" : "Pending Requests"} Found</h2>
                        </div>
                        <section className="accessrequests-list">
                            {accessRequestsElements}
                        </section>
                    </>
                )
            }
        </>
    )
}

export default CourseAccessRequests;