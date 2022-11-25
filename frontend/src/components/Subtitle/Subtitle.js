import React from "react";
import ArrowDownIcon from '../../images/ArrowDownIcon.png'
import ArrowUpIcon from '../../images/ArrowUpIcon.png'

function Subtitle(props) {

    let hours;
    let minutes
    if(props.duration > 60) {
        hours = (props.duration / 60).toFixed(0);
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
            // let allCourseData = {
            //     ...courseData,
            //     TotalHours: calcTotalHours(),
            //     Subtitles: subtitles,
            //     Exercises: exercises,
            //     Subject: subject.value
            // }
            // return InstructorService.addCourse(allCourseData)
            //     .then((result) => {
            //         setMessage({ text: `A new Course with title "${result.data.Title}" is added correctly`, type: "form--successmessage" })
            //         setCourseData({Title: "", Description: "", PriceInUSD: "", ImgURL: ""})
            //         setSubtitles([
            //             {subtitle: "", duration: ""},
            //             {subtitle: "", duration: ""}
            //         ])
            //         setExercises([""])
            //     })
            //     .catch((error) => {
            //         setMessage({ text: error.response.data, type: "form--errormessage" })
            //     })
        }
    }

    function checkSubmit() {
        let filled = true
        if(subtitleDetails.youtubeLink === "" || subtitleDetails.description === "") {
            filled = false;
        }
        else {
            if(!validateYouTubeUrl(subtitleDetails.youtubeLink)) {
                setMessage({ text: "Youtube link is not valid", type: "form--errormessage"})
                return false;
            }
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
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

    return (
        <>
            <div className="subtitle" onClick={displaySubtitlesDetails}>
                {!showSubtitleDetails && <img src={ArrowDownIcon} alt='Arrow Down Icon' className='subtitle--arrow' />}
                {showSubtitleDetails && <img src={ArrowUpIcon} alt='Arrow Up Icon' className='subtitle--arrow' />}
                <p className="subtitle--name">{props.subtitle}</p>
                {hours && <span className="subtitle--duration">{hours}hr {minutes}min</span>}
                {!hours && <span className="subtitle--duration">{props.duration}min</span>}
            </div>
            {props.userType === "instructor" && showSubtitleDetails && 
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
                <button type="submit" className="subtitledetails--submitbutton">Add</button>
                <p className={message.type}>{message.text}</p>
            </form>}
        </> 
    )
}

export default Subtitle;