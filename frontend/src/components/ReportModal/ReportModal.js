import React from "react";
import Select from 'react-select'
import XIcon from '../../images/XIcon.png';
import CourseService from "../../services/Course.service";

function ReportModal(props) {

    const [Loading, setLoading] = React.useState(false);

    const [errorMessage, setErrorMessage] = React.useState({
        emptyReasonMessage: '',
        submitErrorMessage: ''
    });

    const [type, setType] = React.useState(null);
    const [description, setDescription] = React.useState('');

    const reportReasons = [
        { value: 'Financial', label: 'Financial' },
        { value: 'Technical', label: 'Technical' },
        { value: 'other', label: 'other' },
    ]

    if (props.showReportModal) {
        document.body.classList.add('active-modal');
    }
    else {
        document.body.classList.remove('active-modal')
    }

    function handleCloseModal() {
        setErrorMessage({
            emptyReasonMessage: '',
            submitErrorMessage: ''
        });
        props.toggleReportModal();
    }

    function changeType(value) {
        setType(value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value);
    }

    function handleSubmitRequest() {
        if (type === null) {
            setErrorMessage(prevErrors => (
                {
                    ...prevErrors,
                    emptyReasonMessage: 'Please select the type of your report'
                }
            ));
        }
        else if (description === '') {
            setErrorMessage(prevErrors => (
                {
                    ...prevErrors,
                    submitErrorMessage: 'Please describe the reason for your report'
                }
            ));
        }
        else {
            setErrorMessage({
                emptyReasonMessage: '',
                submitErrorMessage: '',
            });
            setLoading(true);
            CourseService.reportProblem(props.courseId, description, type.value).then(() => {
                setLoading(false);
                setDescription('');
                setType(null);
                props.toggleReportModal();
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
            {props.showReportModal &&
                (
                    <>
                        <div className="modal">
                            <div onClick={handleCloseModal} className="overlay"></div>
                            <div className="modal-content">
                                <img src={XIcon} alt='X Icon' className='x--icon' />
                                <button className="close-modal" onClick={handleCloseModal}></button>
                                <h2>What problem are you facing?</h2>
                                <div className="modal--content--rating">
                                    <h3>Reason</h3>
                                    <Select
                                        placeholder="Select Reason"
                                        classNamePrefix="react-select"
                                        className='react-select-container refund'
                                        options={reportReasons}
                                        value={type}
                                        onChange={changeType}
                                    />
                                    <p className="error--emptyrating">{errorMessage.emptyReasonMessage}</p>
                                    <h3>Please Describe your Problem in Details</h3>
                                    <textarea
                                        className="review--text"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Write a Description ..."
                                    />
                                    <div className="ratemodal--actionbuttons">
                                        {
                                            Loading ?
                                                (
                                                    <div className="ratemodal--spinner"></div>
                                                ) :
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

export default ReportModal;