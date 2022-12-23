import React from "react"
import Subtitle from "../Subtitle/Subtitle"
import { Rating } from "@mui/material"

function CourseDetailsPreview(props){

    let courseSubtitles = props.Subtitles.map((subtitle, index) => {
        let tempTitle = ""
        if(subtitle.subtitle === ""){
            tempTitle = "Enter Subtitle " + (index+1)
        }
        else{
            tempTitle = subtitle.subtitle
        }
        return (
            <Subtitle
                key={index}
                {...subtitle}
                subtitle={tempTitle}
            />
        )
    })

    return(
        <div onClick={props.ToggleCourseDetailsPreview} className="details--preview--div">
            <div className="top--container previewDetails" >
                <div className="container--left previewDetails">
                    <div className="course--path previewDetails">
                        <span className="all--hyperlink previewDetails" >All Courses</span>
                        <span>{" > "}</span>
                        <span className="subject--hyperlink previewDetails">{props.Subject === ""? "Select Subject" : props.Subject}</span>
                    </div>
                    <h1 className="coursedetails--fulltitle previewDetails">{props.Title === ""? "Enter Title" :  props.Title}</h1>
                    <p className="coursedetails--description previewDetails">{props.Description === ""? "Enter Description" :  props.Description}</p>
                    <div className="coursedetails--ratecounthourcount previewDetails">
                        <Rating className='coursedetails--rating previewDetails' name="read-only" value={0} precision={0.1} readOnly />
                        <span className='coursedetails--numberratings previewDetails'><span className = "coursedetails--ratingsUnderline previewDetails">0 Ratings</span></span>
                        <span className='coursedetails--hourscount previewDetails'><i className="fa-solid fa-clock previewDetails"></i> &nbsp;0 Hours</span>
                    </div>
                    {<p className="coursedetails--instructor previewDetails">Created by:{<span className="instructor--hyperlink previewDetails">{props.InstructorName}</span>}</p> }
                </div>
                <div className="container--right previewDetails">
                    <div className='coursedetails--courseimagepriceenroll previewDetails'>
                        { props.ImgURL === "" && <div className='coursedetails--image previewDetails product-preview-details '></div>}
                        { props.ImgURL !== "" && <img src={props.ImgURL} alt='' className='coursedetails--image previewDetails'/>}
                        {
                            (
                                <div className="coursedetails--priceenroll previewDetails">
                                    <div className="coursedetials--pricediscount previewDetails">
                                        { props.PriceInUSD === 0 && <span className='coursedetails--price previewDetails'><i className="fa-solid fa-tag previewDetails"></i>&nbsp;FREE</span>}
                                        { props.PriceInUSD !== 0 && <span className='coursedetails--price previewDetails'><i className="fa-solid fa-tag previewDetails"></i>&nbsp;{props.PriceInUSD} USD</span>}
                                    </div>
                                    {<button className='button--enroll previewDetails'>Enroll Now</button>}
                                </div>
                            )
                        }
                        
                    </div>
                </div>
            </div>
            <div className="coursedetails--subtitles previewDetails">
                <h2 className="coursedetails--subtitlesheader previewDetails">Subtitles</h2>
                {courseSubtitles}
            </div>

        </div>
    )
}

export default CourseDetailsPreview;