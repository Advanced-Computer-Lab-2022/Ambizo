import React from "react";
import InstructorService from "../../services/Instructor.service";
import YouTube from 'react-youtube';

function CoursePreview(props) {

    const [coursePreviewYoutubeLink, setCoursePreviewYotubeLink] = React.useState("");

    function handleCoursePreviewLinkChange(event) {
        const{ value } = event.target
        setCoursePreviewYotubeLink(value);
    }

    const [message, setMessage] = React.useState(
        { text: "", type: ""}
    )

    async function handleSubmit(event) { 
        event.preventDefault();
        if (checkSubmit()) {
            return InstructorService.addCoursePreview(coursePreviewYoutubeLink, props.courseId)
                .then((result) => {
                    props.modifyCourseDetailsPagePreview(coursePreviewYoutubeLink)
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    function checkSubmit() {
        if(coursePreviewYoutubeLink === "") {
            setMessage({ text: "Above Field is Required", type: "form--errormessage" })
            return false;
        }
        else {
            if(!validateYouTubeUrl(coursePreviewYoutubeLink)) {
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
        width: '85%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
    }

    return (
        <>
            {props.userType === "instructor" && !props.CoursePreviewLink &&
                <form className="course--preview" onSubmit={handleSubmit} >
                    <input
                        id="youtubeLink"
                        name="youtubeLink"
                        type="text"
                        placeholder="Enter Youtube Video Link"
                        className="youtubelink--input"
                        onChange={handleCoursePreviewLinkChange}
                        value={coursePreviewYoutubeLink}
                    />
                    <button type="submit" className="coursepreview--submitbutton"><i class="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Course Preview</button>
                    <p className={message.type}>{message.text}</p>
                </form>
            }
            {props.userType === "instructor" && props.CoursePreviewLink &&
                <div className="coursepreview--video">
                    <YouTube className="subtitle--video" videoId={validateYouTubeUrl(props.CoursePreviewLink)} opts={opts} />
                    <button className="coursepreview--deletebutton"><i class="fa-solid fa-trash"></i>&nbsp;&nbsp;Delete Preview Video</button>
                </div>
            }
        </>
    )
}

export default CoursePreview;