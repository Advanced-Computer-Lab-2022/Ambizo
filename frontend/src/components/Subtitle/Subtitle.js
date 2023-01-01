import React from "react";
import {useNavigate} from "react-router-dom"
import ArrowDownIcon from '../../images/ArrowDownIcon.png'
import ArrowUpIcon from '../../images/ArrowUpIcon.png'
import InstructorService from "../../services/Instructor.service";
import TraineeService from "../../services/Trainee.service";
import YouTube from 'react-youtube';
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function Subtitle(props) {
    const navigate = useNavigate();

    const [deleteModal, setDeleteModal] = React.useState(false);
    const [grade, setGrade] = React.useState(-1);

    const toggleConfirmationModal = () => {
        setDeleteModal(prevModal => !prevModal);
    };

    React.useEffect(() => {
        if(props.exercise && props.isTraineeEnrolled){
            TraineeService.getAnswers(props.courseId, props.index)
            .then(answers => {
                if (answers.data?.grade > -1) {
                    setGrade(answers.data.grade);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [props.exercise, props.courseId, props.index, props.isTraineeEnrolled]);

    function updateDuration(event){
        if(!props.duration && props.instructorLoggedInCourse){
            const seconds = event.target.getDuration()
            const minutes = Math.floor(seconds / 60)
            let newSubtitle = {
                subtitle: props.subtitle,
                duration: minutes,
                youtubeLink: subtitleDetails.youtubeLink,
                description: subtitleDetails.description
            }
            InstructorService.addSubtitleDetails(props.index , newSubtitle, props.courseId)
                .then((res) => {
                    props.modifyCourseDetailsPageSubtitle(newSubtitle, props.index, res.data.newTotalMinutes);
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    async function handleConfirm(event) {
        event.preventDefault();
        let newSubtitle = 
        {
            subtitle: props.subtitle,
            duration: props.duration,
            youtubeLink: "",
            description: ""
        }
        InstructorService.addSubtitleDetails(props.index, newSubtitle, props.courseId)
            .then((res) => {
                newSubtitle.duration = null;
                props.modifyCourseDetailsPageSubtitle(newSubtitle, props.index, res.data.newTotalMinutes);
                toggleConfirmationModal();
                setSubtitleDetails({
                    youtubeLink: "",
                    description: ""
                })
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
            })
    }

    let hours;
    let minutes
    if(props.duration >= 60) {
        hours = Math.floor((props.duration / 60));
        minutes = props.duration % 60;
    }

    const [showSubtitleDetails, setShowSubtitleDetails] = React.useState(false);

    function displaySubtitlesDetails() {
        setShowSubtitleDetails(!showSubtitleDetails);
    }

    const [subtitleDetails, setSubtitleDetails] = React.useState(
        {
            youtubeLink: "",
            description: ""
        }
    )

    function handleSubtitleDetailsChange(event) {
        const{name, value} = event.target
        setSubtitleDetails(prevSubtitleDetails => {
            return {
                ...prevSubtitleDetails,
                [name] : value
            }
        })
    }

    const [message, setMessage] = React.useState(
        { text: "", type: ""}
    )

    async function handleSubmit(event) { 
        event.preventDefault();
        if (checkSubmit()) {
            let newSubtitle = {
                subtitle: props.subtitle,
                youtubeLink: subtitleDetails.youtubeLink,
                description: subtitleDetails.description
            }
            return InstructorService.addSubtitleDetails(props.index , newSubtitle, props.courseId)
                .then(() => {
                    props.modifyCourseDetailsPageSubtitle(newSubtitle, props.index);
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    function checkSubmit() {
        if(subtitleDetails.youtubeLink === "" || subtitleDetails.description === "") {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        else {
            if(!validateYouTubeUrl(subtitleDetails.youtubeLink)) {
                setMessage({ text: "Youtube link is not valid", type: "form--errormessage"})
                return false;
            }
        }
        return true;
    }

    function validateYouTubeUrl(youtubeLink) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(youtubeLink.match(p)){
            return youtubeLink.match(p)[1];
        }
        return false;
    }

    const opts = {
        height: '390',
        width: '95%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
    }

    let subtitleProgress = (props.progress*100).toFixed(0);
    let isSubtitleClickable =  (props.instructorLoggedInCourse || (props.isTraineeEnrolled && props.refundStatus !== "Processing"));
    let isSubtitleClickableInstructor = props.userType === "instructor" && props.instructorLoggedInCourse;
    let blockSubtitles = (!isSubtitleClickable && (props.userType === "individualTrainee" || props.userType === "corporateTrainee")) || !sessionStorage.getItem("User") || (props.userType === "instructor" && !props.instructorLoggedInCourse);
    return (
        <>
            <div className="subtitle" onClick={displaySubtitlesDetails} style={{"--progress": subtitleProgress+"%", "cursor": (blockSubtitles? "default" : "pointer")}}>
                {!showSubtitleDetails && !blockSubtitles && <img src={ArrowDownIcon} alt='Arrow Down Icon' className='subtitle--arrow' />}
                {showSubtitleDetails && !blockSubtitles && <img src={ArrowUpIcon} alt='Arrow Up Icon' className='subtitle--arrow' />}
                <p className="subtitle--name">{props.subtitle} {props.isTraineeEnrolled && <span className="subtitle--progress">{subtitleProgress}%</span>}</p>
                {hours && <span className="subtitle--duration">{hours}hr {minutes}min</span>}
                {!hours && <span className="subtitle--duration">{props.duration}min</span>}
            </div>
            { isSubtitleClickableInstructor && showSubtitleDetails && !props.youtubeLink &&
                <form className="subtitle--details" onSubmit={handleSubmit}>
                    <input
                        id="youtubeLink"
                        name="youtubeLink"
                        type="text"
                        placeholder="Enter Youtube Video Link"
                        className="youtubelink--input"
                        onChange={handleSubtitleDetailsChange}
                        value={subtitleDetails.youtubeLink}
                    />
                    <textarea 
                        id="description"
                        name="description"
                        className="shortdescription--input" 
                        placeholder="Enter a Short Description of the Video" 
                        rows="4" 
                        cols="50"
                        onChange={handleSubtitleDetailsChange}
                        value={subtitleDetails.description}
                    >
                    </textarea>
                    <button type="submit" className="subtitledetails--submitbutton"><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add</button>
                    <p className={message.type}>{message.text}</p>
                </form>
            }
            { isSubtitleClickable && showSubtitleDetails && props.youtubeLink &&
                <div className="subtitle--detailsfilled">
                    <h4>Video:</h4>
                    <YouTube className="subtitle--video" videoId={validateYouTubeUrl(props.youtubeLink)} opts={opts} onPlay={props.updateSubtitleProgress} onReady={updateDuration}/>
                    <h4>Video Short Description:</h4>
                    <p className="subtitle--description">{props.description}</p>
                    {props.instructorLoggedInCourse &&
                        <>
                            <button className="subtitle--deletebutton" onClick={toggleConfirmationModal}><i className="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete Video and Description</button>
                            <ConfirmationModal 
                                confirmModal={deleteModal} 
                                toggleConfirmationModal={toggleConfirmationModal} 
                                confirmationMessage="Are you sure you want to delete the Subtitle Video and Description?" 
                                actionCannotBeUndone={true} 
                                handleConfirm={handleConfirm} />
                        </>
                    }
                    { props.exercise &&
                        <>
                            <h4>Exercise:</h4>
                            <p className="subtitle--description">{props.exercise.props.exerciseTitle}</p>
                            {props.instructorLoggedInCourse &&
                                <>
                                    <div className="exercise--view--delete--div">
                                        <button onClick={() => navigate("/exercise/" + props.courseId + "/" + props.index)}><i className="fa-solid fa-eye"></i>&nbsp;&nbsp;View Exercise</button>
                                        <button onClick={null}><i className="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete Exercise</button>
                                    </div>
                                </>
                            }
                            {props.isTraineeEnrolled && 
                                <>
                                    {grade === -1?    
                                        (
                                            <>
                                                <i><p className="subtitle--description addExercise">Not Yet Solved</p></i>
                                                <button className="subtitle--deletebutton solve" onClick={() => navigate("/exercise/" + props.courseId + "/" + props.index)}><i className="fa-solid fa-lightbulb"></i>&nbsp;&nbsp;Solve Exercise</button>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <p className="subtitle--description addExercise"><i>Grade: <b>{((grade * 100).toFixed(1) % 1) === 0 ? (grade * 100).toFixed(0) : (grade * 100).toFixed(1)}%</b></i> { grade < 0.5? "😞" : grade > 0.86?"😀🎉" : "😀"}</p>
                                                <button className="subtitle--deletebutton solve" onClick={() => navigate("/exercise/" + props.courseId + "/" + props.index)}><i className="fa-solid fa-eye"></i>&nbsp;&nbsp;View Solution</button>          
                                            </>
                                        )  
                                    }
                                </>
                            }
                        </>
                    }
                    { !props.exercise && props.instructorLoggedInCourse &&
                        <>
                            <h4>Exercise:</h4>
                            <i><p className="subtitle--description addExercise">Not Yet Created</p></i>
                            <button className="subtitle--createexercise" onClick={() => navigate("/addExercise/" + props.courseId + "/" + props.index)}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Create Exercise</button>
                        </>          
                    }
                </div>
            }
        </> 
    )
}

export default Subtitle;