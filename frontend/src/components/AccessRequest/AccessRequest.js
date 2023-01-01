import React from "react"
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import AdministratorService from "../../services/Administrator.service";
import { useNavigate } from 'react-router-dom'

function AccessRequest(props) {

    const navigate = useNavigate()

    const [acceptRequestModal, setAcceptRequestModal] = React.useState(false);

    const toggleAcceptRequestModal = () => {
        setAcceptRequestModal(prevModal => !prevModal);
    };

    async function handleAcceptRequest(event) {
        event.preventDefault();
        props.setIsLoading(true)
        await AdministratorService.grantAccess(props.CorporateTraineeUsername, props.CourseId)
        .then((result) => {
            props.removeHandledRequest(props.CorporateTraineeUsername, props.CourseId);
            props.setIsLoading(false);
        })
        .catch((error) => {
            props.setIsLoading(false);
            console.log(error);
        })
    }

    const [declineRequestModal, setDeclineRequestModal] = React.useState(false);

    const toggleDeclineRequestModal = () => {
        setDeclineRequestModal(prevModal => !prevModal);
    };

    async function handleDeclineRequest(event) {
        event.preventDefault();
        props.setIsLoading(true)
        await AdministratorService.declineAccess(props.CorporateTraineeUsername, props.CourseId)
        .then((result) => {
            props.removeHandledRequest(props.CorporateTraineeUsername, props.CourseId);
            props.setIsLoading(false);
        })
        .catch((error) => {
            props.setIsLoading(false);
            console.log(error);
        })
    }

    return (
        <>
            <div className="accessrequest">
                <div className="accessrequest--info">
                    <div className="accessrequest--corporate">
                        <p className="accesscourse--info">Corporate Username:</p>
                        <h3>{props.CorporateTraineeUsername}</h3>
                    </div>
                    <div className="accessrequest--course">
                        <p className="accesscourse--info">Course title:</p>
                        <h3 className="accesscourse--title" onClick={() => navigate(`/coursedetails/${props.CourseId}`)}>{props.CourseTitle}</h3>
                    </div>
                </div>
                <div className="accessrequest--buttons">
                    <button className='accessrequest--acceptbutton' onClick={toggleAcceptRequestModal}>Accept</button>
                    <ConfirmationModal confirmModal={acceptRequestModal} toggleConfirmationModal={toggleAcceptRequestModal} 
                        confirmationMessage="Are you sure you want to grant course access to this corporate trainee?" actionCannotBeUndone={true} 
                        discountDetails = {`Corporate Username: ${props.CorporateTraineeUsername}, Course Title: ${props.CourseTitle}`} handleConfirm={handleAcceptRequest} />
                    <button className='accessrequest--declinebutton' onClick={toggleDeclineRequestModal}>Decline</button>
                    <ConfirmationModal confirmModal={declineRequestModal} toggleConfirmationModal={toggleDeclineRequestModal} 
                        confirmationMessage="Are you sure you want to decline this course access request?" actionCannotBeUndone={true} 
                        discountDetails = {`Corporate Username: ${props.CorporateTraineeUsername}, Course Title: ${props.CourseTitle}`} handleConfirm={handleDeclineRequest} />
                </div>
            </div>
        </>
    )
}

export default AccessRequest;