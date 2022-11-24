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

    const [subtitleDetails, setSubtitleDetails] = React.useState(false);

    return (
        <>
            <div className="subtitle">
                {!subtitleDetails && <img src={ArrowDownIcon} alt='Arrow Down Icon' className='subtitle--arrow' />}
                {subtitleDetails && <img src={ArrowUpIcon} alt='Arrow Up Icon' className='subtitle--arrow' />}
                <p className="subtitle--name">{props.subtitle}</p>
                {hours && <span className="subtitle--duration">{hours}hr {minutes}min</span>}
                {!hours && <span className="subtitle--duration">{props.duration}min</span>}
            </div>
            {props.userType === "instructor" && <form className="subtitle--details">
                <input
                    type="text"
                    placeholder="Enter Youtube Video Link"
                    className="youtubelink--input"
                    // onChange={handleChange}
                    // name="ImgURL"
                    // value={courseData.ImgURL}
                />
                <textarea 
                    className="shortdescription--input" 
                    placeholder="Enter a Short Description of the Video" 
                    rows="4" 
                    cols="50">
                </textarea>
                <button
                    type="submit"
                    className="subtitledetails--submitbutton"
                >
                Add    
                </button>
            </form>}
        </> 
    )
}

export default Subtitle;