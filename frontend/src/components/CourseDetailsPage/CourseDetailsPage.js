import React from "react";
import Header from "../Header/Header";
import { Rating } from "@mui/material";
import PriceIcon from '../../images/PriceIcon.png'
import Subtitle from "../Subtitle/Subtitle";
import Exercise from "../Exercise/Exercise";
import { useParams, useNavigate } from "react-router-dom";
import CourseService from "../../services/Course.service";
import countryToCurrency  from 'country-to-currency';
import CoursePreview from "../CoursePreview/CoursePreview"

async function retrieveCourse(id, setIsLoading){
    setIsLoading(true);
    return CourseService.getCourse(id)
    .then((result) => {
        return result;
    })
}

function CourseDetailsPage() {
    const navigate = useNavigate();

    function modifyCourseDetailsPageSubtitle(newSubtitle, index) {
        let modifiedCourse = {...course};
        modifiedCourse.Subtitles[index] = newSubtitle;
        setCourse(modifiedCourse);
    }

    function modifyCourseDetailsPagePreview(newPreviewLink) {
        let modifiedCourse = {...course};
        modifiedCourse.CoursePreviewLink = newPreviewLink;
        setCourse(modifiedCourse);
    }
    
    const userType = sessionStorage.getItem("Type");

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
            setIsLoading(false); 
        })
    }, [params.courseId]);

    let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";

    let instructorLoggedInCourse = false;
    
    if(userType === "instructor") {
        const sessionInstructorName = JSON.parse(sessionStorage.getItem("User")).Username;
        if(sessionInstructorName === course.InstructorUsername) {
            instructorLoggedInCourse = true;
        }
    }

    let courseSubtitles;
    let courseExercises;

    if (course.Subtitles && course.Exercises) {
        courseExercises = course.Exercises.map((exercise, index) => {
            return (
                <Exercise 
                    key={index}
                    exerciseTitle={exercise.exerciseName}
                    exerciseNum={index}
                    instructorLoggedInCourse={instructorLoggedInCourse}
                    courseId={params.courseId}
                />
            )
        })

        let subtitleIndex = -1;
        courseSubtitles = course.Subtitles.map(subtitle => {
            subtitleIndex++;
            return (
                <Subtitle
                    key={subtitleIndex}
                    index={subtitleIndex}
                    courseId={params.courseId}
                    userType={userType}
                    instructorLoggedInCourse={instructorLoggedInCourse}
                    modifyCourseDetailsPageSubtitle={(newSubtitle, index) => modifyCourseDetailsPageSubtitle(newSubtitle, index)}
                    exercise={courseExercises[subtitleIndex]? courseExercises[subtitleIndex] : null}
                    {...subtitle}
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
                                {!instructorLoggedInCourse && 
                                <>
                                    <a className="all--hyperlink" onClick={() => navigate("/")}>All Courses</a>
                                    <span>{" > "}</span>
                                    <a className="subject--hyperlink" onClick={() => navigate("/search/" + course.Subject)}>{course.Subject}</a>
                                </>}
                                {instructorLoggedInCourse && <a className="all--hyperlink" onClick={() => navigate("/mycourses")}>My Courses</a> }
                                
                            </div>
                            <h1 className="coursedetails--fulltitle">{course.Title}</h1>
                            <p className="coursedetails--description">{course.Description}</p>
                            <div className="coursedetails--ratecounthourcount">
                                <Rating className='coursedetails--rating' name="half-rating-read" defaultValue={course.Rating} precision={0.1} readOnly />
                                <span className='coursedetails--numberratings'>({course.NumberOfReviews} ratings)</span>
                                <span className='coursedetails--hourscount'><i className="fa-solid fa-clock"></i> &nbsp;{course.TotalHours} {hourSpan}</span>
                            </div>
                            {!instructorLoggedInCourse && <p className="coursedetails--instructor">Created by:{<a className="instructor--hyperlink" href="">{course.InstructorName}</a>}</p> }
                        </div>
                        <div className="container--right">
                            <div className='coursedetails--courseimagepriceenroll'>
                                <img className="coursedetails--image" src={course.ImgURL} alt='Course' />
                                <div className="coursedetails--priceenroll">
                                    {userType !== "instructor" && <img src={PriceIcon} alt='Price Icon' className={course.Discount === 0 ? 'coursedetails--priceicon' : 'coursedetails--priceicondiscounted'} />}
                                    {userType === "instructor" && <img src={PriceIcon} alt='Price Icon' className='coursedetails--priceiconinstr' />}
                                    <div className="coursedetials--pricediscount">
                                        {course.PriceInUSD === 0 && <span className='coursedetails--price'>FREE</span>}
                                        {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--price'>{(course.PriceInUSD*((100-course.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                                        {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--oldprice'>{course.PriceInUSD} {currencyCode}</span>}
                                        {course.PriceInUSD !== 0 && course.Discount===0 && <span className='coursedetails--price'>{course.PriceInUSD} {currencyCode}</span>}
                                        {!userType === "instructor" && course.Discount>0 && <p className="coursedetails--discount">Don't miss out on the {course.Discount}% discount!</p>}
                                    </div>
                                    {userType !== "instructor" && <button className={course.Discount === 0 ? 'button--enroll' : 'button--enrolldiscounted'}>Enroll now</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="coursedetails--subtitles">
                        <h2 className="coursedetails--previewheader">Course Preview</h2>
                        <CoursePreview userType={userType} courseId={params.courseId} CoursePreviewLink={course.CoursePreviewLink} 
                        modifyCourseDetailsPagePreview={(newPreviewLink) => modifyCourseDetailsPagePreview(newPreviewLink)}
                        instructorLoggedInCourse={instructorLoggedInCourse} />
                        <h2 className="coursedetails--subtitlesheader">Subtitles</h2>
                        {courseSubtitles}
                    </div>
                </>
            )
            }
        </>
    )
}

export default CourseDetailsPage;