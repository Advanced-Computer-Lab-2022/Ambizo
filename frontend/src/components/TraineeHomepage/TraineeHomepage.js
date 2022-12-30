import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import TraineeImage from '../../images/TraineeImage.svg'
import TraineeImage2 from '../../images/TraineeImage2.svg'
import TraineeImage3 from '../../images/TraineeImage3.svg'
import TraineeService from "../../services/Trainee.service.js";
import Course from "../Course/Course";
import { Helmet } from "react-helmet";

function TraineeHomepage() {
    const navigate = useNavigate();

    function scrollTo(id){
        document.getElementById(id).scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }

    const [traineeInfo, setTraineeInfo] = React.useState({});

    React.useEffect(() => {
        TraineeService.getTraineeData(JSON.parse(sessionStorage.getItem("User")).Username).then(
            response => {
                console.log(response.data.CourseInfo)
                console.log(response.data.EnrolledCourses)
                setTraineeInfo(response.data);
            }
          ).catch(error => {
                console.log(error);
          })
    }, [])

    let courseIndex = 0;
    let coursesDataElements = traineeInfo?.CourseInfo?.map(course => {
        let overallProgress = 0;
        let totalDuration = 0;
        let subtitles =  course.Subtitles;
        let progress = [];
        for (let index = 0; index < traineeInfo.EnrolledCourses.length; index++) {
            if(traineeInfo.EnrolledCourses[index].courseId === course._id) {
                progress = traineeInfo.EnrolledCourses[index].progress;
                break;
            } 
        }
        if(progress && progress.length > 0){
            for(let i =0; i<subtitles.length;i++){
                if(progress[i]){
                    overallProgress += (progress[i]*subtitles[i].duration);
                }
                totalDuration += subtitles[i].duration;
            }
            if(totalDuration > 0){
                overallProgress /= totalDuration;  
            }
        }
        courseIndex++;
        return (
            <Course
                key={course._id}
                myCoursesTrainee={true}
                overallProgress={(overallProgress*100).toFixed(0)}
                {...course}
            />
        )
      });

    return (
        <div className="homepage">
            <Helmet>
                <title>Homepage</title>
            </Helmet>
            <Header />
            <div className='trainee--options'>
                <div className='trainee--leftcontainer'>
                    <h1 className='trainee-header'>Welcome, {JSON.parse(sessionStorage.getItem("User")).Name}!</h1>
                    <hr className="trainee--line"/>    

                    <div className='trainee--buttons'>
                        <button className='trainee--setpromobutton' onClick={() => navigate(`/user/${JSON.parse(sessionStorage.getItem("User")).Username}`)}><i className="fa-solid fa-user"></i>&nbsp;&nbsp;My Profile</button>
                    </div>
                    <div className='trainee--buttons'>
                        <button className='trainee--setpromobutton' onClick={() => scrollTo("mycourses")}><i className="fa-solid fa-eye"></i>&nbsp;&nbsp;My Courses</button>
                        <button className='trainee--setpromobutton' onClick={() => navigate("/allcourses")}><i className="fa-solid fa-eye"></i>&nbsp;&nbsp;View All Courses</button> 
                        <button className='trainee--setpromobutton' onClick={() => navigate('/allreports')}><i className="fa-solid fa-eye"></i>&nbsp;&nbsp;View My Reports</button>
                    </div>
                </div>
                <div className='trainee--rightcontainer'>
                    <div>
                    <img className="traineeright--image3 image2" src={TraineeImage2} alt = 'Trainee ' />
                        
                        <img className="traineeright--image" src={TraineeImage} alt='Trainee' />
                        <img className="traineeright--image3" src={TraineeImage3} alt = 'Trainee ' />
                    </div>
                    <h2 className="traineeright--header">“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”... Never stop learning!</h2>
                </div>
            </div>
            <div id="mycourses">
                <div className='coursesTitleFilter'>
                    <div className='coursesTitleFilter--header'>
                        <p>My Courses</p>
                    </div>
                </div>
                <hr className='header--line'/>
                <section className="courses-list">
                    {coursesDataElements}
                    {coursesDataElements?.length === 0 && <p className="no--courses">0 Courses found.</p>}
                </section>
            </div>
        </div>
    )
}

export default TraineeHomepage;