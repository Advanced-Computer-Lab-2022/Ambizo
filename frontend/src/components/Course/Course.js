import React from 'react';
import Rating from '@mui/material/Rating';
import countryToCurrency  from 'country-to-currency';
import HourIcon from '../../images/HourIcon.png'
import PriceIcon from '../../images/PriceIcon.png'
import { useNavigate } from 'react-router-dom'

function Course(props) {

    const navigate = useNavigate()
    function viewCourseDetails() {
        setTimeout(() => {
            navigate(`/coursedetails/${props._id}`)
        }, 150);
    }

    function selectCourse() {
        
    }

    let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
    let hours;
    let minutes;
    if(props?.TotalMinutes >= 60) {
        hours = Math.floor((props.TotalMinutes / 60));
        minutes = props.TotalMinutes % 60;
    }

    let yourCourse = false
    if(sessionStorage.getItem("Type") === "instructor") {
        if(JSON.parse(sessionStorage.getItem("User")).Username === props.InstructorUsername) {
            yourCourse = true
        }
    }

    function handleAdminSelectionChange(event) {
        props.handleAdminSelectionChange(event);
    }

    return (
        <>
            { props.isLoading ?
            (
                <>
                    <div className='course'>
                        <div className='course--image product-loading-1 background-masker'></div>
                        <div className='course--image product-loading-2 background-masker'></div>
                        <div className='course--image product-loading-3 background-masker'></div>
                        <div className='course--image product-loading-4 background-masker'></div>
                    </div>
                </>
            )
            :
            (
                <>
                    <div id="course" className={sessionStorage.getItem("Type") === "corporateTrainee" ? 'course--noprice' : props.adminSetPromo && !props.isChecked ? 'course--tobeselected' : props.adminSetPromo && props.isChecked ? 'course--selected' : props.Preview? 'course previewDetails' : 'course'} onClick={props.adminSetPromo ?  selectCourse : (props.Preview? props.ToggleCourseDetailsPreview : viewCourseDetails)}>
                        {props.adminSetPromo &&
                        <input 
                            type='checkbox' 
                            className='admin--selectcourses' 
                            name={props._id}
                            id={props.id}
                            onChange={handleAdminSelectionChange} 
                            checked={props.isChecked} 
                        />
                        }
                        <div>
                            {props.Preview && props.ImgURL === "" && <div className='course--image product-preview '></div>}
                            {(!props.Preview || props.ImgURL !== "") && <img src={props.ImgURL} alt='' className='course--image'/>}
                        </div>
                        {!props.userProfile && <h3 className='course--title'>{(props.Preview && props.Title === "")? "Enter Title" : (props.Title.length > 60 ? props.Title.substring(0, 57) + "..." : props.Title)}</h3>}
                        {props.userProfile && <h3 className='course--title'>{props.Title}</h3>}
                        <div className='courseinfo'>
                            <div className='courseinfo--left'>
                                <p className='course--instructor'>{props.InstructorName}</p>
                                <div className='course--hours'>
                                    <img src={HourIcon} alt='Hour Icon' className='hour--icon'/>
                                    <span className='hours--count'>{props.Preview? 0 :""} 
                                        {!props.Preview &&hours && <span>{hours}hr {minutes}min</span>}
                                        {!props.Preview && !hours && <span>{props.TotalMinutes}min</span>}
                                    </span>
                                </div>
                                <div>
                                    <Rating className='course--rating' name="half-rating-read" defaultValue={props.Rating} precision={0.1} readOnly />
                                    <span className='number--reviews'>({props.Preview? 0 : props.NumberOfReviews})</span>
                                </div>
                                {!props.myCoursesTrainee && sessionStorage.getItem("Type") !== "corporateTrainee" &&
                                    <div className='course--price'>
                                        {props.PriceInUSD === 0 && <span className='price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;FREE</span>}
                                        {props.PriceInUSD !== 0 && props.Discount>0 && <span className='price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;{(props.PriceInUSD*((100-props.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                                        {props.PriceInUSD !== 0 && props.Discount>0 && <span className='old--price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;{props.PriceInUSD} {currencyCode}</span>}
                                        {props.PriceInUSD !== 0 && props.Discount===0 && <span className='price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;{props.PriceInUSD} {currencyCode}</span>}
                                        {props.PriceInUSD === "0" && props.Preview && <span className='price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;FREE</span>}
                                        {props.PriceInUSD !== "0" && props.Preview && <span className='price'><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;{props.PriceInUSD} USD</span>}
                                    </div>
                                }
                                {props.myCoursesTrainee && <span className='traineeprogresspercentage'><b>{props.overallProgress}%</b> of course completed</span>}
                            </div>
                            <div>
                                {yourCourse && <p className='yourcourse'>Your Course</p>}
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </>
        

    )
}

export default Course;