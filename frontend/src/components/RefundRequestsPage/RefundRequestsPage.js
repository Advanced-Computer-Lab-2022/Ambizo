import React from 'react';
import Header from "../Header/Header"
import RefundImage from "../../images/RefundImage.svg"
import AdministratorService from "../../services/Administrator.service";
import RefundRequest from '../RefundRequest/RefundRequest';
import { Helmet } from "react-helmet";



function RefundRequestsPage() {

    const [isLoading, setIsLoading] = React.useState(true);
    const [refundRequestsData, setRefundRequestsData] = React.useState([]);

    React.useEffect(() => {
        AdministratorService.getAllRefundRequests().then(
            response => {
                if (response.status === 200) {
                    setRefundRequestsData(response.data);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    console.log(response.status);
                    console.log(response.data);
                }
            }
        ).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }, []);

    function removeHandledRequest(courseId, traineeUsername){
        setRefundRequestsData(prevRefundRequestsData => {
            return prevRefundRequestsData.filter(request => (request.CourseId !== courseId && request.TraineeUsername !== traineeUsername));
        });
    }

    const refundRequestsElements = refundRequestsData.map(request => {
        return (
            <RefundRequest
                key={request._id}
                setIsLoading={setIsLoading}
                removeHandledRequest={removeHandledRequest}
                {...request}
            />
        );
    });
    return (
        <>
            <Helmet>
                <title>Refund Requests</title>
            </Helmet>
            <div className={"loader-container" + (!isLoading ? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {
                isLoading ? (
                    <> 
                        <Header />
                    </>
                ):(
                    <>
                        <Header />
                        <div className="accessrequests--headerdiv">
                            <h1 className="accessrequests--header">Refund Requests</h1>
                            <img className="accessrequests--pricesimage refund" src={RefundImage} alt='Refund Requests' />
                        </div>
                        <div className="accessrequests--number">
                            <h2>{refundRequestsData.length} Pending {refundRequestsData.length === 1 ? "Request" : "Requests"}</h2>
                        </div>
                        <section className="accessrequests-list">
                            {refundRequestsElements}
                        </section>
                    </>
                )
            }

        </>
    );
}


export default RefundRequestsPage;