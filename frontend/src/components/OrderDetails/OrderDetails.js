import React from 'react';
import Rating from '@mui/material/Rating';
import HourIcon from '../../images/HourIcon.png'

function OrderDetails(props) {
    let hours;
    let minutes;
    if (props?.courseDetails.duration >= 60) {
        hours = Math.floor((props.courseDetails.duration / 60));
        minutes = props.courseDetails.duration % 60;
    }
    console.log('here')
    console.log(props.courseDetails.image);
    return (
        <>
            <h2>Order Details</h2>
            <div className='order-details-div'>
                {props.courseDetails.image ? (
                    <img src={props.courseDetails.image} alt='' className='course-details-image' />
                ) : (
                    <div className='course-details-image-preview'></div>
                )
                }
                <div className='course-details'>
                    <h3 className='course--details--title'>{props.courseDetails.title}</h3>
                    <p className='course--instructor'>{props.courseDetails.instructorName}</p>
                    <div className='course--hours'>
                        <img src={HourIcon} alt='Hour Icon' className='order--hour--icon' />
                        {hours && <span>{hours}hr {minutes}min</span>}
                        {!hours && <span>{props.TotalMinutes}min</span>}
                    </div>
                    <div>
                        <Rating className='course--rating' name="half-rating-read" defaultValue={props.courseDetails.rating} precision={0.1} readOnly />
                        <span className='number--reviews'>({props.courseDetails.numberOfRatings})</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetails;