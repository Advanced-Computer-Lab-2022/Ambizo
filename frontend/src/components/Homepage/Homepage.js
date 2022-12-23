import React from 'react';
import Header from '../Header/Header';
import HomepageImage from '../../images/HomepageImage.svg'
import AttendOnlineCourses from '../../images/AttendOnlineCourses.svg'
import AssessYourLevel from '../../images/AssessYourLevel.svg'
import GetYourCertification from '../../images/GetYourCertification.svg'
import CoursesPage from '../CoursesPage/CoursesPage';
import { useNavigate } from "react-router-dom"
import useIsInViewport from './isInViewPort';

function Homepage() {
    const navigate = useNavigate();

    const ref1 = React.useRef(null);
    const isInViewport1 = useIsInViewport(ref1);
    const ref2 = React.useRef(null);
    const isInViewport2 = useIsInViewport(ref2);
    const ref3 = React.useRef(null);
    const isInViewport3 = useIsInViewport(ref3);

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
                                onClick={toggleSignUp}
                            >
                            <i class="fa-solid fa-user-plus"></i>&nbsp;&nbsp;&nbsp;&nbsp;Sign up
                            </button>
                        </div>
                        <img className="homepage--image" src={HomepageImage} alt='Homepage' />
                    </div>
                    <div className='homepage--middlecontainer'>
                        <div>
                            <div className={'homepage--attendcourses' + (isInViewport1? " show" : "")} ref={ref1}>
                                <div>
                                    <h2>Attend online courses from the convenience of your home.</h2>
                                </div>    
                                <img className="homepage--attendimage" src={AttendOnlineCourses} alt='Attend Courses' />
                            </div>
                            <hr className="homepage--line"/>
                            <div className={'homepage--assessyourlevel' + (isInViewport2? " show" : "")} ref={ref2}>
                                <img className="homepage--assessimage" src={AssessYourLevel} alt='Assess Your Level' />
                                <div>
                                    <h2>Assess your level by solving online exercises and exams.</h2>
                                </div>
                            </div>
                            <hr className="homepage--line"/>
                            <div className={'homepage--attendcourses' + (isInViewport3? " show" : "")} ref={ref3}>
                                <div>
                                    <h2>Get a certification after completing the course successfully.</h2>
                                </div>    
                                <img className="homepage--getimage" src={GetYourCertification} alt='Get Certification' />
                            </div>
                        </div>
                    </div>
                    <div className='homepage--popularcourses'>
                        <CoursesPage mostPopular={true} sectionNotPage={true}/>
                    </div>
                    <div className='homepage--whyambizo'>
                        <p className='whyambizo--header'>Why Ambizo?</p>
                        <p className='homepage--whyreasons'>
                        Our exclusive content is co-created and continually refined with industry leaders. Each Ambizo program is deeply focused—eliminating guesswork in selecting the right course. Projects go far beyond step-by-step guides, cultivating the critical thinking required for workplace relevance. Expert mentors unblock learning with personalized support, and verify complete mastery of competencies.
                        </p>
                    </div>
                </>
            )
            }
        </>
    )
}

export default Homepage;