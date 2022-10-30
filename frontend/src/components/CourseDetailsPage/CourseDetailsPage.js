import React from "react";
import Header from "../Header/Header";
import { Rating } from "@mui/material";
import HourIcon from '../../images/HourIcon.png'
import PriceIcon from '../../images/PriceIcon.png'
import Subtitle from "../Subtitle/Subtitle";
import Exercise from "../Exercise/Exercise";


function CourseDetialsPage() {

    return (
        <>
            <Header />
            <div className="top--container">
                <div className="container--left">
                    <div className="course--path">
                        <a className="all--hyperlink" href="">All Courses</a>
                        <span>{" > "}</span>
                        <a className="subject--hyperlink" href="">Software Development</a>
                    </div>
                    <h1 className="coursedetails--fulltitle">Python For Beginners - Learn Programming From Scratch Learn Programming From Scratch Learn Programming</h1>
                    <p className="coursedetails--description">Python For Beginners : This course is meant for absolute beginners in programming or in python.</p>
                    <div>
                        <Rating className='coursedetails--rating' name="half-rating-read" defaultValue={3.5} precision={0.1} readOnly />
                        <span className='coursedetails--numberratings'>(500 ratings)</span>
                        <img src={HourIcon} alt='Hour Icon' className='coursedetails--houricon'/>
                        <span className='coursedetails--hourscount'>2.6 Hours</span>
                    </div>
                    <p className="coursedetails--instructor">Created by:{<a className="instructor--hyperlink" href="">Slim Abdelzaher</a>}</p>
                </div>
                <div className="container--right">
                    <div className='coursedetails--courseimagepriceenroll'>
                        <img className="coursedetails--image" src="https://img-c.udemycdn.com/course/240x135/836376_8b97_4.jpg" alt='Course' />
                        <div className="coursedetails--priceenroll">
                            <img src={PriceIcon} alt='Price Icon' className='coursedetails--priceicon'/>
                            <span className='coursedetails--price'>19.99 USD</span>
                            <button className='button--enroll'>Enroll now</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="coursedetails--subtitles">
                <h2 className="coursedetails--subtitlesheader">Subtitles</h2>
                <Subtitle />
                <Subtitle />
                <Subtitle />
                <Subtitle />
                <Subtitle />
                <Subtitle />

                <h2 className="coursedetails--exercisesheader">Exercises</h2>
                <Exercise />
                <Exercise />
                <Exercise />
                <Exercise />
                <Exercise />
                <Exercise />
            </div>
        </>
    )
}

export default CourseDetialsPage;