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
<<<<<<< HEAD
                    <div id="course" className={props.adminSetPromo && !props.isChecked ? 'course--tobeselected' : props.adminSetPromo && props.isChecked ? 'course--selected' : props.Preview? 'course previewDetails' : 'course'} onClick={props.adminSetPromo ?  selectCourse : (props.Preview? props.ToggleCourseDetailsPreview : viewCourseDetails)}>
=======
                    <div className={sessionStorage.getItem("Type") === "corporateTrainee" ? 'course--noprice' : props.adminSetPromo && !props.isChecked ? 'course--tobeselected' : props.adminSetPromo && props.isChecked ? 'course--selected' : 'course'} onClick={!props.adminSetPromo ? viewCourseDetails : selectCourse}>
>>>>>>> bc2be05cd328d69407e273cc6fe9f5fc7780f609
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
                        <h3 className='course--title'>{(props.Preview && props.Title === "")? "Enter Title" : (props.Title.length > 60 ? props.Title.substring(0, 57) + "..." : props.Title)}</h3>
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
<<<<<<< HEAD
                                <div className='course--price'>
                                    <img src={PriceIcon} alt='Price Icon' className='price--icon'/>
                                    {props.PriceInUSD === 0 && <span className='price'>FREE</span>}
                                    {props.PriceInUSD !== 0 && props.Discount>0 && <span className='price'>{(props.PriceInUSD*((100-props.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                                    {props.PriceInUSD !== 0 && props.Discount>0 && <span className='old--price'>{props.PriceInUSD} {currencyCode}</span>}
                                    {props.PriceInUSD !== 0 && props.Discount===0 && <span className='price'>{props.PriceInUSD} {currencyCode}</span>}
                                    {props.PriceInUSD === "0" && props.Preview && <span className='price'>FREE</span>}
                                    {props.PriceInUSD !== "0" && props.Preview && <span className='price'>{props.PriceInUSD} USD</span>}

                                </div>
=======
                                {sessionStorage.getItem("Type") !== "corporateTrainee" &&
                                    <div className='course--price'>
                                        <img src={PriceIcon} alt='Price Icon' className='price--icon'/>
                                        {props.PriceInUSD === 0 && <span className='price'>FREE</span>}
                                        {props.PriceInUSD !== 0 && props.Discount>0 && <span className='price'>{(props.PriceInUSD*((100-props.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                                        {props.PriceInUSD !== 0 && props.Discount>0 && <span className='old--price'>{props.PriceInUSD} {currencyCode}</span>}
                                        {props.PriceInUSD !== 0 && props.Discount===0 && <span className='price'>{props.PriceInUSD} {currencyCode}</span>}
                                    </div>
                                }
>>>>>>> bc2be05cd328d69407e273cc6fe9f5fc7780f609
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