import React from "react"
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import AdministratorService from "../../services/Administrator.service";
import { useNavigate } from 'react-router-dom'

function RefundRequest(props) {
    const navigate = useNavigate()

    const [acceptRequestModal, setAcceptRequestModal] = React.useState(false);

    const toggleAcceptRequestModal = () => {
        setAcceptRequestModal(prevModal => !prevModal);
    };

    async function handleAcceptRequest(event) {
        event.preventDefault();
        props.setIsLoading(true);
        await AdministratorService.acceptRefundRequest({courseId: props.CourseId, traineeUsername: props.TraineeUsername}).then(
            response => {
                props.setIsLoading(false);
                props.removeHandledRequest(props.CourseId, props.TraineeUsername);
            }
        ).catch(error => {
            console.log(error);
            props.setIsLoading(false);
        })
    }

    const [declineRequestModal, setDeclineRequestModal] = React.useState(false);

    const toggleDeclineRequestModal = () => {
        setDeclineRequestModal(prevModal => !prevModal);
    };

    async function handleDeclineRequest(event) {
        event.preventDefault();
        props.setIsLoading(true)
        await AdministratorService.rejectRefundRequest({courseId: props.CourseId, traineeUsername: props.TraineeUsername}).then(
            response => {
                props.setIsLoading(false);
                props.removeHandledRequest(props.CourseId, props.TraineeUsername);
            }
        ).catch(error => {
            console.log(error);
            props.setIsLoading(false);
        })

    }


    return (
        <>
        <div className="accessrequest">
            <div className="accessrequest--info">
                <div className="accessrequest--corporate">
                    <p className="accesscourse--info">Trainee Username:</p>
                    <h3>{props.TraineeUsername}</h3>
                </div>
                <div className="accessrequest--course">
                    <p className="accesscourse--info">Course title:</p>
                    <h3 className="accesscourse--title" onClick={() => navigate(`/coursedetails/${props.CourseId}`)}>{props.CourseTitle}</h3>
                </div>
                <div className="accessrequest--course">
                    <p className="accesscourse--info">Reason:</p>
                    <h3 className="accesscourse--title">{props.Reason}</h3>
                </div>
                <div className="accessrequest--course">
                    <p className="accesscourse--info">Description:</p>
                    <h3 className="accesscourse--title">{props.Description}</h3>
                </div>
            </div>
            <div className="accessrequest--buttons">
                <button className='accessrequest--acceptbutton' onClick={toggleAcceptRequestModal}>Accept</button>
                <ConfirmationModal confirmModal={acceptRequestModal} toggleConfirmationModal={toggleAcceptRequestModal} 
                    confirmationMessage="Are you sure you want to refund this payment?" actionCannotBeUndone={true} 
                    discountDetails = {`Individual Trainee Username: ${props.TraineeUsername}, Course Title: ${props.CourseTitle}`} handleConfirm={handleAcceptRequest} />
                <button className='accessrequest--declinebutton' onClick={toggleDeclineRequestModal}>Decline</button>
                <ConfirmationModal confirmModal={declineRequestModal} toggleConfirmationModal={toggleDeclineRequestModal} 
                    confirmationMessage="Are you sure you want to decline refunding this payment?" actionCannotBeUndone={true} 
                    discountDetails = {`Individual Trainee Username: ${props.TraineeUsername}, Course Title: ${props.CourseTitle}`} handleConfirm={handleDeclineRequest} />
            </div>
        </div>
    </>

    );
}


export default RefundRequest;