import React from "react";
import Header from "../Header/Header";
import { Rating } from "@mui/material";
import HourIcon from '../../images/HourIcon.png'
import PriceIcon from '../../images/PriceIcon.png'
import Subtitle from "../Subtitle/Subtitle";
import Exercise from "../Exercise/Exercise";
import { useParams } from "react-router-dom";
import CourseService from "../../services/Course.service";
import countryToCurrency  from 'country-to-currency';

async function retrieveCourse(id, setIsLoading){
    setIsLoading(true);
    return CourseService.getCourse(id)
    .then((result) => {
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

function CourseDetailsPage() {

    const params = useParams();
    const [course, setCourse] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        document.title = "Course Details";
        retrieveCourse(params.courseId, setIsLoading)
        .then(course => {
            setCourse(course.data)
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
        })
    }, [params.courseId]);

    let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";

    let courseSubtitles;
    let courseExercises;

    if (course.Subtitles && course.Exercises) {
        courseSubtitles = course.Subtitles.map(subtitle => {
            return (
                <Subtitle
                    key={subtitle.subtitle}
                    {...subtitle}
                />
            )
        })

        courseExercises = course.Exercises.map(exerciseTitle => {
            return (
                <Exercise 
                    key={exerciseTitle}
                    exerciseTitle={exerciseTitle}
                />
            )
        })
    }

    let hourSpan = course.TotalHours>1? "Hours" : "Hour"
    return (
        <>
            {isLoading ?
            (
                <>
                    <div className="loader-container">
                        <div className="spinner"> </div>
                    </div>
                    <Header />
                    <div className="top--container" style={{"height":"500px"}} >
                    </div>
                </>

            )
            :
            (
                <>
                    <Header />
                    <div className="top--container" >
                        <div className="container--left">
                            <div className="course--path">
                                <a className="all--hyperlink" href="">All Courses</a>
                                <span>{" > "}</span>
                                <a className="subject--hyperlink" href="">{course.Subject}</a>
                            </div>
                            <h1 className="coursedetails--fulltitle">{course.Title}</h1>
                            <p className="coursedetails--description">{course.Description}</p>
                            <div className="coursedetails--ratecounthourcount">
                                <Rating className='coursedetails--rating' name="half-rating-read" defaultValue={course.Rating} precision={0.1} readOnly />
                                <span className='coursedetails--numberratings'>({course.NumberOfReviews} ratings)</span>
                                <div className="coursedetails--hour">
                                    <img src={HourIcon} alt='Hour Icon' className='coursedetails--houricon'/>
                                    <span className='coursedetails--hourscount'>{course.TotalHours} {hourSpan}</span>
                                </div>
                            </div>
                            <p className="coursedetails--instructor">Created by:{<a className="instructor--hyperlink" href="">{course.InstructorName}</a>}</p>
                        </div>
                        <div className="container--right">
                            <div className='coursedetails--courseimagepriceenroll'>
                                <img className="coursedetails--image" src={course.ImgURL} alt='Course' />
                                <div className="coursedetails--priceenroll">
                                    <img src={PriceIcon} alt='Price Icon' className={course.Discount === 0 ? 'coursedetails--priceicon' : 'coursedetails--priceicondiscounted'} />
                                    <div className="coursedetials--pricediscount">
                                        {course.PriceInUSD === 0 && <span className='coursedetails--price'>FREE</span>}
                                        {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--price'>{(course.PriceInUSD*((100-course.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                                        {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--oldprice'>{course.PriceInUSD} {currencyCode}</span>}
                                        {course.PriceInUSD !== 0 && course.Discount===0 && <span className='coursedetails--price'>{course.PriceInUSD} {currencyCode}</span>}
                                        {course.Discount>0 && <p className="coursedetails--discount">Don't miss out on the {course.Discount}% discount!</p>}
                                    </div>
                                    <button className={course.Discount === 0 ? 'button--enroll' : 'button--enrolldiscounted'}>Enroll now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="coursedetails--subtitles">
                        <h2 className="coursedetails--subtitlesheader">Subtitles</h2>
                        {courseSubtitles}
                        <h2 className="coursedetails--exercisesheader">Exercises</h2>
                        {courseExercises}
                    </div>
                </>
            )
            }
           
        </>
    )
}

export default CourseDetailsPage;