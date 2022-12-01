import React, { cloneElement } from "react";
import XIcon from '../../images/XIcon.png';
import { Rating } from "@mui/material";


/*
props structure = {
    showRateModal --> control whether the modal will be displayed or not.
    toggleRateModal --> same purpose as above.
    updateRateModal --> update props with user input
    subjectId --> holds a value for the courseID or instructor username.
    submitAction --> the service that save the changes.
    deleteAction --> the function that delets the rating.. can be null.
    ratingSubject --> course or instructor?
    Rating --> can be null when inserting a new rating.
    Review --> same as rating.
    updateTraineeInfo --> a function that updates the course 
                            details page with the rating instead of 
                            making a useless request to get the ratings the user has just entered.
}
*/
function RatingModal(props){

    if(props.showRateModal) {
        document.body.classList.add('active-modal');
    } 
    else {
        document.body.classList.remove('active-modal')
    }


    const  [Loading, setLoading] = React.useState(false);

    function handleSubmitRating(){

        const newRating = {
            Rating: (props.Rating)? props.Rating : 5,
            Review: (props.Review)? props.Review : ''
        }

        setLoading(true);
        props.submitAction(props.subjectId, newRating).then(
            _ => {
                props.updateTraineeInfo(props.ratingSubject, newRating)
                setLoading(false);
                props.toggleRateModal();
            }
        ).catch(error => {
            console.log(error);
        });
    }

    function handleDelete(){
        setLoading(true);
        props.deleteAction(props.subjectId).then(
            _ => {
                props.updateTraineeInfo(props.ratingSubject, null);
                setLoading(false);
                props.toggleRateModal();
            }
        )
    }
    

    return (
        <>
            {props.showRateModal &&
            (
                <>
                    <div className="modal">
                        <div onClick={props.toggleRateModal} className="overlay"></div>
                        <div className="modal-content">
                            <img src={XIcon} alt='X Icon' className='x--icon'/>
                            <button className="close-modal" onClick={props.toggleRateModal}></button>
                            <h2>How do you rate {(props.ratingSubject === 'course')? 'this course' : 'the instructor of this course'}?</h2>
                            <div className="modal--content--rating">
                                <h3>Rating</h3>
                                <Rating
                                    name="simple-controlled"
                                    value={props.Rating? props.Rating : 5}
                                    size="large"
                                    precision={0.5}
                                    onChange={(_, newRating) => {
                                        props.updateRateModal('Rating', newRating)
                                    }}
                                />
                                <span className="ratingspan">{props.Rating? props.Rating : 5}</span>
                                <h3>Review</h3>
                                <textarea 
                                    id="Review"
                                    name="Review"
                                    value= {props.Review}
                                    onChange = {(event) => {
                                        props.updateRateModal('Review', event.target.value);
                                    }}
                                    placeholder="Enter your review." 

                                />
                                <div className="ratemodal--actionbuttons">
                                    {
                                        Loading?
                                        (
                                            <div className="ratemodal--spinner"></div>
                                        ):
                                        (
                                            <>
                                                <button onClick={handleSubmitRating}>Submit Rating</button>
                                                {props.deleteAction && (
                                                    <button onClick={handleDelete}>Delete Rating</button>
                                                )}
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )
            }
        </>
    );
}

export default RatingModal;