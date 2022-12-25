import React, { useState } from "react";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header.js"
import InstructorService from "../../services/Instructor.service";
import Course from "../Course/Course";
import CourseDetailsPreview from "../CourseDetailsPreview/CourseDetailsPreview";
import AddCourseImage from '../../images/AddCourse.svg'
import { Helmet } from "react-helmet";

function AddCourse() {

    const navigate = useNavigate();

    const [courseData, setCourseData] = useState(
        { Title: "", Description: "", PriceInUSD: "", ImgURL: ""}
    )

    const [subtitles, setSubtitles] = useState([
        {subtitle: ""},
        {subtitle: ""}
    ])

    const [message, setMessage] = useState(
        { text: "", type: ""}
    )
    const [subject, setSubject] = useState('')
    const options = [
                        { value: 'Software Development', label: 'Software Development' },
                        { value: 'Business', label: 'Business' },
                        { value: 'Personal Development', label: 'Personal Development' },
                        { value: 'Design', label: 'Design' },
                        { value: 'Mathematics', label: 'Mathematics' },
                        { value: 'Marketing', label: 'Marketing' },
                        { value: 'Photography', label: 'Photography' },
                        { value: 'Health and Fitness', label: 'Health and Fitness' },
                        { value: 'Music', label: 'Music' }
                    ]

    const[courseDetailsPreview, setCourseDetailsPreview] = React.useState(true);

    function toggleCourseDetailsPreview(){
        setCourseDetailsPreview(prevPreview => !prevPreview)
    }
  
    function changeSubject(value){
        setSubject(value)
    }
    
    function handleChange(event) {
        const { name, value } = event.target
        setCourseData(prevCourseData => ({
            ...prevCourseData,
            [name]: value
        }))
    }

    function handleSubtitlesChange(index, event) {
        let data = [...subtitles];
        data[index][event.target.name] = event.target.value;
        setSubtitles(data);
    }

    function checkSubmit() {
        //check all fields are filled
        let filled = true
        for (const field in courseData) {
            if (courseData[field] === "")
                filled = false
        }
        for (let i =0; i<subtitles.length; i++) {
            if (subtitles[i].title === ""){
                filled = false
            }
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        return true;
    }

    function addSubtitle(){
        let newSubtitle = { subtitle: '' }
        setSubtitles([...subtitles, newSubtitle])
    }

    function removeSubtitle(index){
        let data = [...subtitles];
        data.splice(index, 1)
        setSubtitles(data)
    }

    async function handleSubmit(event) { 
        event.preventDefault();
        if (checkSubmit()) {
            let allCourseData = {
                ...courseData,
                Subtitles: subtitles,
                Subject: subject.value
            }
            return InstructorService.addCourse(allCourseData)
                .then((result) => {
                    setCourseData({Title: "", Description: "", PriceInUSD: "", ImgURL: ""})
                    setSubtitles([
                        {subtitle: ""},
                        {subtitle: ""}
                    ])
                    navigate("/coursedetails/"+result.data._id);
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    return (
        <>
            <Helmet>
                <title>Add Course</title>
            </Helmet>
            <Header />
            <div className="adminpromo--headerdiv">
                <h1 className="adminpromotions--header">Create New Course</h1>
                <img className="addCourse--image" src={AddCourseImage} alt='Prices' />
            </div>
            <div className="addCourse--container">
                <div className="addCourse--leftcontainer">
                        <h1 className="addCourse--header">Add Course</h1>
                        <form className="addCourse--form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                onChange={handleChange}
                                name="Title"
                                value={courseData.Title}
                                className="addCourse--inputfield"
                            />
                            {subtitles.map((input, index) => {
                                return(
                                    <div key={index} className="dynamic-form--div">
                                        <input
                                            type="text"
                                            placeholder={"Enter Subtitle "+(index+1)}
                                            onChange={event => handleSubtitlesChange(index, event)}
                                            name="subtitle"
                                            value={input.subtitle}
                                            className="addCourse--inputfield"
                                        />
                                        {subtitles.length>1 && <i className="fa-solid fa-square-xmark removeSubtitle" onClick={() => removeSubtitle(index)}></i>}
                                    </div>
                                )
                            })}
                            <button type="button" className="form--button addSubtitle" onClick={addSubtitle}>+ Add Subtitle</button>
                            <Select placeholder="Select Subject" classNamePrefix="react-select" className='react-select-container' options={options} value={subject} onChange={changeSubject} />
                            <input
                                type="text"
                                placeholder="Enter Description"
                                onChange={handleChange}
                                name="Description"
                                value={courseData.Description}
                                className="addCourse--inputfield"
                            />
                            <input
                                type="number"
                                placeholder="Enter Price in USD"
                                onChange={handleChange}
                                name="PriceInUSD"
                                value={courseData.PriceInUSD}
                                className="addCourse--inputfield"
                            />
                            <input
                                type="text"
                                placeholder="Enter Image URL"
                                onChange={handleChange}
                                name="ImgURL"
                                value={courseData.ImgURL}
                                className="addCourse--inputfield"
                            />
                            <button type="submit" className="addCourse--button">Submit</button>
                            <p className={message.type}>{message.text}</p>
                        </ form>
                </div>
                <div className='addCourse--rightcontainer'>
                    <h1 className="addCourse--header">Course Preview</h1>
                    {!courseDetailsPreview &&
                        <Course
                            InstructorName={ JSON.parse(sessionStorage.getItem("User"))?.Name}
                            ImgURL={courseData.ImgURL}
                            Title={courseData.Title}
                            PriceInUSD={courseData.PriceInUSD}
                            Preview={true}
                            ToggleCourseDetailsPreview={toggleCourseDetailsPreview}
                        />
                    }
                    {courseDetailsPreview &&
                        <CourseDetailsPreview
                            InstructorName={ JSON.parse(sessionStorage.getItem("User"))?.Name}
                            ImgURL={courseData.ImgURL}
                            Title={courseData.Title}
                            PriceInUSD={courseData.PriceInUSD}
                            ToggleCourseDetailsPreview={toggleCourseDetailsPreview}
                            Description={courseData.Description}
                            Subtitles={subtitles}
                            Subject={subject.label? subject.label: ""}
                        />
                    }

                </div>
            </div>
           
        </>
    )
}

export default AddCourse;
