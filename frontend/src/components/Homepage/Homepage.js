import React from 'react';
import Header from '../Header/Header';
import HomepageImage from '../../images/HomepageImage.png'
import AttendOnlineCourses from '../../images/AttendOnlineCourses.jpg'
import AssessYourLevel from '../../images/AssessYourLevel.jpg'
import GetYourCertification from '../../images/GetYourCertification.jpg'
import CoursesPage from '../CoursesPage/CoursesPage';
import { useNavigate } from "react-router-dom"

function Homepage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        document.title = "Homepage";
    }, []);

    const toggleSignUp = () => {
        navigate("/signUp");
    }

    return (
        <>
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading?
            (
                <>
                    <Header />
                </>
            )
            :
            (
                <>
                    <Header />
                    <div className='homepage--topcontainer'>
                        <div className='homepage--headerbutton'>
                            <h1 className='homepage--header'>No Limitation To Your Education.</h1>
                            <button 
                                id='delete-product-button'
                                className='homepagebutton--signup'
                                // disabled={}
                                onClick={toggleSignUp}
                            >Sign up
                            </button>
                        </div>
                        <img className="homepage--image" src={HomepageImage} alt='Homepage' />
                    </div>
                    <div className='homepage--middlecontainer'>
                        <div>
                            <div className='homepage--attendcourses'>
                                <div>
                                    <h2>Attend online courses from the convenience of your home.</h2>
                                    <hr className="homepage--line"/>
                                </div>    
                                <img className="homepage--attendimage" src={AttendOnlineCourses} alt='Attend Courses' />
                            </div>
                            <div className='homepage--assessyourlevel'>
                                <img className="homepage--assessimage" src={AssessYourLevel} alt='Assess Your Level' />
                                <div>
                                    <h2>Assess your level by solving online exercises and exams.</h2>
                                    <hr className="homepage--line"/>
                                </div>
                            </div>
                            <div className='homepage--attendcourses'>
                                <div>
                                    <h2>Get a certification after completing the course successfully.</h2>
                                    <hr className="homepage--line"/>
                                </div>    
                                <img className="homepage--getimage" src={GetYourCertification} alt='Get Certification' />
                            </div>
                        </div>
                    </div>
                    <CoursesPage mostPopular={true} sectionNotPage={true}/>
                </>
            )
            }
        </>
    )
}

export default Homepage;