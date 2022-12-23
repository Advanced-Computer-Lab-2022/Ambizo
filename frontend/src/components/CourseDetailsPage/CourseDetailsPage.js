import React from "react";
import Header from "../Header/Header";
import { Rating } from "@mui/material";
import Subtitle from "../Subtitle/Subtitle";
import Exercise from "../Exercise/Exercise";
import { useParams, useNavigate } from "react-router-dom";
import CourseService from "../../services/Course.service";
import TraineeService from "../../services/Trainee.service";
import countryToCurrency  from 'country-to-currency';
import CoursePreview from "../CoursePreview/CoursePreview"
import RateModal from "../RatingModal/RatingModal";
import RequestRefundModal from "../RequestRefundModal/RequestRefundModal";
import UserRating from "../UserRating/UserRating";
import InstructorService from "../../services/Instructor.service";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import Certificate from "../Certificate/Certificate";
import ReportModal from "../ReportModal/ReportModal";
import { PDFDownloadLink } from '@react-pdf/renderer';

async function retrieveCourse(id, traineeUsername){
    return CourseService.getCourse(id, traineeUsername)
    .then((result) => {
        return result;
    })
}

function CourseDetailsPage() {
    const navigate = useNavigate();

    const [rateModal, setRateModal] = React.useState(false);

    const toggleRateModal = () => {
        setRateModal(prevModal => !prevModal);
    };

    const [refundModal, setRefundModal] = React.useState(false);

    const toggleRefundModal = () => {
        setRefundModal(prevModal => !prevModal);
    };

    const [reportModal, setReportModal] = React.useState(false);

    const toggleReportModal = () => {
        setReportModal(prevModal => !prevModal);
    };

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
    const [isLoading, setIsLoading] = React.useState(true);

    // This is the state object that controls the rating modal and behavior. 
    const [modalConfig, setModalConfig] = React.useState({
        showRateModal: rateModal,
        toggleRateModal: toggleRateModal,
        updateRateModal: null,
        subjectId: null,
        submitAction: null,
        deleteAction:null,
        ratingSubject: null,
        Rating:null,
        Review: null,
        updateTraineeInfo: null
    });

    // case user is trainee;
    const [traineeInfo, setTraineeInfo] = React.useState({
        isTraineeEnrolled: false,
        traineeCourseRate: null,
        traineeInstructorRate: null,
        subtitlesProgress: [],
        overallProgress: 0
    });

    const [refundStatus, setRefundStatus] = React.useState("None");



    React.useEffect(() => {
        document.title = "Course Details";

        let traineeUsername = (userType === 'individualTrainee' || userType === 'corporateTrainee')?
        (JSON.parse(sessionStorage.getItem('User')).Username):
        null;        
        retrieveCourse(params.courseId, traineeUsername)
        .then(course => {
            setCourse(course.data.courseData)
            setTraineeInfo({
                isTraineeEnrolled: course.data.traineeEnrolled,
                traineeCourseRate: course.data.traineeCourseRate,
                traineeInstructorRate: course.data.traineeInstructorRate,
                subtitlesProgress: course.data.subtitlesProgress? course.data.subtitlesProgress: [],
                overallProgress: course.data.overallProgress? course.data.overallProgress : 0
            });

            if(course.data.traineeEnrolled && userType === "individualTrainee"){
                TraineeService.getRefundStatus(params.courseId)
                .then(status => setRefundStatus(status.data))
                .catch(error => console.log(error))
            }

            
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);  
        })
    }, [params.courseId, modalConfig.Rating, modalConfig.Review, userType]);

    function modifyModalConfigFromModal(key , value){
        setModalConfig(prevValue => (
            {
                ...prevValue,
                [key]: value
            }
        ));
    }

    function updateTraineeRating(subject, newRating, ratingStats){
        if(subject === 'course'){
            setTraineeInfo(prevTraineeInfo => (
                {
                    ...prevTraineeInfo,
                    traineeCourseRate: newRating? newRating: null
                }
            ));         
            setCourse(prevCourseData =>{
                return ({
                    ...prevCourseData,
                    Rating: ratingStats.newAverageRating,
                    NumberOfReviews: ratingStats.newNumberOfRatings
                })
            });
            navigate(0); //to update ratings section at the bottom of the page
        }else{
            setTraineeInfo(prevTraineeInfo => (
                {
                    ...prevTraineeInfo,
                    traineeInstructorRate: newRating? newRating: null
                }
            ));
        }
        
    }

    // Configure the modal for rating course and opening it
    function rateCourseModalConfig(){
        setModalConfig({
            showRateModal: rateModal,
            toggleRateModal: toggleRateModal,
            updateRateModal: modifyModalConfigFromModal,
            subjectId: params.courseId,
            submitAction: TraineeService.rateCourse,
            deleteAction:null,
            ratingSubject: 'course',
            Rating:null,
            Review: null,
            updateTraineeInfo: updateTraineeRating
        });
        toggleRateModal();
    }

    // Config the modal to update a course Rating.
    function updateRateModalConfig(){
        setModalConfig({
            showRateModal: rateModal,
            toggleRateModal: toggleRateModal,
            updateRateModal: modifyModalConfigFromModal,
            subjectId: params.courseId,
            submitAction: TraineeService.updateCourseRating,
            deleteAction:TraineeService.deleteCourseRating,
            ratingSubject: 'course',
            Rating:traineeInfo.traineeCourseRate.Rating,
            Review: traineeInfo.traineeCourseRate.Review,
            updateTraineeInfo: updateTraineeRating
        });
        toggleRateModal();

    }

    // Config the modal to rate an instructor.
    function rateInstructorModalConfig(){
        setModalConfig({
            showRateModal: rateModal,
            toggleRateModal: toggleRateModal,
            updateRateModal: modifyModalConfigFromModal,
            subjectId: course.InstructorUsername,
            submitAction: TraineeService.rateInstructor,
            deleteAction:null,
            ratingSubject: 'instructor',
            Rating:null,
            Review: null,
            updateTraineeInfo: updateTraineeRating
        });
        toggleRateModal();
    }

    // Config the modal to update the instructor rating.
    function updateinstructorModalConfig(){
        setModalConfig({
            showRateModal: rateModal,
            toggleRateModal: toggleRateModal,
            updateRateModal: modifyModalConfigFromModal,
            subjectId: course.InstructorUsername,
            submitAction: TraineeService.updateInstructorRating,
            deleteAction:TraineeService.deleteInstructorRating,
            ratingSubject: 'instructor',
            Rating:traineeInfo.traineeInstructorRate.Rating,
            Review: traineeInfo.traineeInstructorRate.Review,
            updateTraineeInfo: updateTraineeRating
        });
        toggleRateModal();
    }


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
            if(!exercise){
                return null;
            }
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
                    isTraineeEnrolled={traineeInfo.isTraineeEnrolled}
                    progress={traineeInfo.subtitlesProgress[subtitleIndex]? traineeInfo.subtitlesProgress[subtitleIndex] : 0}
                    refundStatus={refundStatus}
                    {...subtitle}
                />
            )
        })
    }

    let ratingDataElements = [];
    let ratingKey = 0;
    if(course.Ratings) {
        ratingDataElements = course.Ratings.map(rating => {
        return (
            <UserRating 
            key={ratingKey++}
            {...rating}
            />
        )
        })
    }

    function scrollTo(id){
        document.getElementById(id).scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }

    const [removeDiscountModal, setRemoveDiscountModal] = React.useState(false);

    const toggleRemoveDiscountModal = () => {
        setRemoveDiscountModal(prev => !prev)
    };

    async function handleRemoveDiscount(event) {
        event.preventDefault();
        return InstructorService.applyDiscount(params.courseId, 0, new Date("2000-01-01"))
            .then((result) => {
                course.Discount = 0
                setRemoveDiscountModal(prev => !prev)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    let hourSpan = course.TotalHours>1? "Hours" : "Hour"
    let courseProgress = (traineeInfo.overallProgress*100).toFixed(0);
    let loggedInName = JSON.parse(sessionStorage.getItem("User"))?.Name;
    let certificateFileName = "";
    if(loggedInName?.charAt(loggedInName.length - 1) === 's'){
        certificateFileName =  + loggedInName + "' Certificate.pdf"
    }
    else{
        certificateFileName = loggedInName + "'s Certificate.pdf"
    }

    return (
        <>
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading ?
            (
                <>
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
                                    <span className="all--hyperlink" onClick={() => navigate("/")} >All Courses</span>
                                    <span>{" > "}</span>
                                    <span className="subject--hyperlink" onClick={() => navigate(`/search/${course.Subject}`)}>{course.Subject}</span>
                                </>}
                                {instructorLoggedInCourse && <span className="all--hyperlink" onClick={() => navigate("/mycourses")}>My Courses</span> }
                                
                            </div>
                            <h1 className="coursedetails--fulltitle">{course.Title}</h1>
                            <p className="coursedetails--description">{course.Description}</p>
                            <div className="coursedetails--ratecounthourcount">
                                <Rating className='coursedetails--rating' name="read-only" value={course.Rating} precision={0.1} readOnly />
                                <span className='coursedetails--numberratings' onClick = {() => scrollTo("allRatings")}>(<span className = "coursedetails--ratingsUnderline">{course.NumberOfReviews} {course.NumberOfReviews === 1 ? "rating" : "ratings"}</span>)</span>
                                <span className='coursedetails--hourscount'><i className="fa-solid fa-clock"></i> &nbsp;{course.TotalHours} {hourSpan}</span>
                            </div>
                            {!instructorLoggedInCourse && <p className="coursedetails--instructor">Created by:{<span className="instructor--hyperlink" onClick={() => navigate(`/user/${course.InstructorUsername}`)}>{course.InstructorName}</span>}</p> }
                        </div>
                        <div className="container--right">
                            <div className='coursedetails--courseimagepriceenroll'>
                                <img className="coursedetails--image" src={course.ImgURL} alt='Course' />
                                {
                                  ((userType === 'individualTrainee' || userType === 'corporateTrainee') && traineeInfo.isTraineeEnrolled) ?
                                  (
                                    <div className="coursedetails--enrolledoptions">
                                        <h3 className="youareenrolled">You are enrolled in this course.</h3>
                                        <div className="enrolledoptions--ratebuttons">
                                            <button 
                                                className="button--rate" 
                                                onClick={!traineeInfo.traineeCourseRate? rateCourseModalConfig: updateRateModalConfig}>
                                                    {!traineeInfo.traineeCourseRate? "Rate Course": "Edit Course Rating"}
                                            </button>
                                            <button 
                                                className="button--rate" 
                                                onClick={!traineeInfo.traineeInstructorRate? rateInstructorModalConfig: updateinstructorModalConfig}>
                                                    {!traineeInfo.traineeInstructorRate? "Rate Instructor": "Edit Instructor Rating"}
                                            </button>
                                        </div>
                                    </div>
                                  ) :
                                  (
                                    <div className="coursedetails--priceenroll">
                                        {/* {userType !== "instructor" && <img src={PriceIcon} alt='Price Icon' className={course.Discount === 0 ? 'coursedetails--priceicon' : 'coursedetails--priceicondiscounted'} />}
                                        {userType === "instructor" && <img src={PriceIcon} alt='Price Icon' className='coursedetails--priceiconinstr' />} */}
                                        <div className="coursedetials--pricediscount">
                                            {course.PriceInUSD === 0 && <span className='coursedetails--price'><i className="fa-solid fa-tag"></i>&nbsp;FREE</span>}
                                            {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--price'><i className="fa-solid fa-tag"></i>&nbsp;{(course.PriceInUSD*((100-course.Discount)/100)).toFixed(2)} {currencyCode}&nbsp;</span>}
                                            {course.PriceInUSD !== 0 && course.Discount>0 && <span className='coursedetails--oldprice'>{course.PriceInUSD} {currencyCode}</span>}
                                            {course.PriceInUSD !== 0 && course.Discount===0 && <span className='coursedetails--price'><i className="fa-solid fa-tag"></i>&nbsp;{course.PriceInUSD} {currencyCode}</span>}
                                            {userType !== "instructor" && course.Discount>0 && <p className="coursedetails--discount">Don't miss out on the {course.Discount}% discount!</p>}
                                            {course.Discount>0 && <p className="coursedetails--discount">Expires on: {new Date(course.DiscountExpiryDate).getDate()}/{new Date(course.DiscountExpiryDate).getMonth() + 1}/{new Date(course.DiscountExpiryDate).getFullYear()}</p>}
                                        </div>
                                        {userType !== "instructor" && <button className='button--enroll'>Enroll Now</button>}
                                        {userType === "instructor" && instructorLoggedInCourse && course.PriceInUSD !== 0 && course.Discount === 0 && <button className='button--enroll' onClick={() => navigate(`/definediscount/${course._id}`)}>Make a Discount</button>}
                                        {userType === "instructor" && instructorLoggedInCourse && course.PriceInUSD !== 0 && course.Discount !== 0 && <button className='button--enroll' onClick={toggleRemoveDiscountModal}><i className="fa-solid fa-trash"></i>&nbsp;&nbsp;Remove Discount</button>}
                                        <ConfirmationModal confirmModal={removeDiscountModal} toggleConfirmationModal={toggleRemoveDiscountModal} 
                                            confirmationMessage="Are you sure you want to remove the discount?" actionCannotBeUndone={false} 
                                            discountDetails = {`Price after removing discount: ${course.PriceInUSD} ${currencyCode}`} handleConfirm={handleRemoveDiscount} />
                                    </div>
                                  )
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className="coursedetails--subtitles">
                        <h2 className="coursedetails--previewheader">Course Preview</h2>
                        <CoursePreview userType={userType} courseId={params.courseId} CoursePreviewLink={course.CoursePreviewLink} 
                        modifyCourseDetailsPagePreview={(newPreviewLink) => modifyCourseDetailsPagePreview(newPreviewLink)}
                        instructorLoggedInCourse={instructorLoggedInCourse} />
                        <h2 className="coursedetails--subtitlesheader">Subtitles</h2>
                        <div className="subtitles--progress--div">
                            <div style={{"width": "50%"}}>
                                {courseSubtitles}
                            </div>
                            {traineeInfo.isTraineeEnrolled && traineeInfo.overallProgress < 1 &&
                                <div className="progress--div">
                                    <p className="progress--div--header">Your Progress</p>
                                    <div className="progress--bar" style={{"--progress": courseProgress+"%"}}></div>
                                    <p className="progress--percentage">You are <b>{courseProgress}%</b> on your way</p>
                                    {userType === "individualTrainee" && traineeInfo.overallProgress < 0.5 && refundStatus ==="None" &&
                                       <p className="progress--percentage refund">Don't like the course? Request a refund from <span className="reset-password" onClick={toggleRefundModal}>here</span></p>
                                    }
                                    {userType === "individualTrainee" && refundStatus === "Processing" &&
                                       <p className="progress--percentage refund">Your refund request is currently processing </p>
                                    }
                                </div>
                            }
                            {traineeInfo.isTraineeEnrolled && traineeInfo.overallProgress === 1 &&
                                <div className="progress--div">
                                    <p className="progress--div--header">Well Done, Course Completed!</p>
                                    <p className="progress--percentage certificate">You can download your certificate from 
                                        <span>
                                            <PDFDownloadLink className="reset-password" document={<Certificate Name={loggedInName} Course={course.Title} />} fileName={certificateFileName}>
                                                {({ blob, url, loading, error }) => {
                                                    return ' here'
                                                }
                                                }
                                            </PDFDownloadLink>
                                        </span>
                                    </p>
                                </div>
                            }
                        </div>
                        
                        <h2 className="coursedetails--subtitlesheader"  id = "allRatings">Ratings</h2>
                        <div className="coursedetails--ratings">
                            {course.Ratings?.length > 0 ? ratingDataElements : <i><p className = "courseDetails--noratings">No ratings yet.</p></i>}
                        </div>
                        
                        <button className="button--report" onClick={toggleReportModal}>Report a problem</button>   
                            
                    </div>

                    <RateModal showRateModal={rateModal} 
                        toggleRateModal={toggleRateModal}
                        subjectId={modalConfig.subjectId}
                        submitAction= {modalConfig.submitAction}
                        deleteAction={modalConfig.deleteAction}
                        ratingSubject={modalConfig.ratingSubject}
                        Rating = {modalConfig.Rating}
                        Review = {modalConfig.Review}
                        updateRateModal = {modalConfig.updateRateModal}
                        updateTraineeInfo= {modalConfig.updateTraineeInfo}
                    />

                    <RequestRefundModal
                        showRefundModal={refundModal}
                        toggleRefundModal={toggleRefundModal}
                        courseId={course._id}
                        setRefundStatus = {setRefundStatus}
                     />


                    <ReportModal
                        showReportModal={reportModal}
                        toggleReportModal={toggleReportModal}
                        courseId={course._id}
                    />    



                </>
            )
            }
        </>
    )
}

export default CourseDetailsPage;