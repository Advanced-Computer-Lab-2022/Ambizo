import React from "react";
import Select from 'react-select'
import XIcon from '../../images/XIcon.png';
import TraineeService from "../../services/Trainee.service";

function RequestRefundModal(props){

    const  [Loading, setLoading] = React.useState(false);

    const  [errorMessage, setErrorMessage] = React.useState({
        emptyReasonMessage: '',
        submitErrorMessage: ''
    });

    const [reason, setReason] = React.useState(null);
    const [description, setDescription] = React.useState('');

    const refundReasons = [
        { value: 'Course is too basic', label: 'Course is too basic' },
        { value: 'Course is too advanced', label: 'Course is too advanced' },
        { value: 'Course is outdated', label: 'Course is outdated' },
        { value: 'Course material is not useful for me', label: 'Course material is not useful for me' },
        { value: 'Instructor\'s delivery needs improvement ', label: 'Instructor\'s delivery needs improvement' },
        { value: 'Course outline is misleading', label: 'Course outline is misleading' },
        { value: 'Technical issues with the platform', label: 'Technical issues with the platform' },
    ]

    if(props.showRefundModal) {
        document.body.classList.add('active-modal');
    } 
    else {
        document.body.classList.remove('active-modal')
    }

    function handleCloseModal(){
        setErrorMessage({
            emptyReasonMessage: '',
            submitErrorMessage: ''
        });
        props.toggleRefundModal();
    }

    function changeReason(value){
        setReason(value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value);
    }
    
    function handleSubmitRequest(){
        if(reason === null){
            setErrorMessage(prevErrors => (
                {
                    ...prevErrors,
                    emptyReasonMessage: 'Please select the reason for your refund'
                }
            ));
        }
        else if(description === ''){
            setErrorMessage(prevErrors => (
                {
                    ...prevErrors,
                    submitErrorMessage: 'Please describe the reason for your refund'
                }
            ));
        }
        else{
            setErrorMessage({
                emptyReasonMessage: '',
                submitErrorMessage: '',
            });
            setLoading(true);
            TraineeService.requestRefund(props.courseId, reason.value, description).then(() => {
                setLoading(false);
                props.toggleRefundModal();
                props.setRefundStatus("Processing");
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                setErrorMessage(prevErrors => (
                    {
                        ...prevErrors,
                        submitErrorMessage: 'An error has occured. Try again later.'
                    }
                ));
    
            });
        }
    }


    return (
        <>
            {props.showRefundModal &&
            (
                <>
                    <div className="modal">
                        <div onClick={handleCloseModal} className="overlay"></div>
                        <div className="modal-content">
                            <img src={XIcon} alt='X Icon' className='x--icon'/>
                            <button className="close-modal" onClick={handleCloseModal}></button>
                            <h2>Why are you requesting a refund?</h2>
                            <div className="modal--content--rating">
                                <h3>Reason</h3>
                                <Select 
                                    placeholder="Select Reason" 
                                    options={refundReasons} 
                                    value={reason} 
                                    onChange={changeReason} 
                                />
                                <p className="error--emptyrating">{errorMessage.emptyReasonMessage}</p>
                                <h3>Please Describe your Problem in Details</h3>
                                <textarea 
                                    className="review--text"
                                    value= {description}
                                    onChange = {handleDescriptionChange}
                                    placeholder="Write a Description ..." 
                                />
                                <div className="ratemodal--actionbuttons">
                                    {
                                        Loading?
                                        (
                                            <div className="ratemodal--spinner"></div>
                                        ):
                                        (
                                            <>
                                                <button className="rating--submitbutton refund" onClick={handleSubmitRequest}>Submit</button>
                                            </>
                                        )
                                    }
                                </div>
                                <p className="error--submitrating">{errorMessage.submitErrorMessage}</p>
                            </div>
                        </div>
                    </div>

                </>
            )
            }
        </>
    );
}

export default RequestRefundModal;