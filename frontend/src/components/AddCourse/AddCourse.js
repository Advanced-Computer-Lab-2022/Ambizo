import React, { useState } from "react";
import Select from 'react-select'
import Header from "../Header/Header.js"
import InstructorService from "../../services/Instructor.service";

function LoginPage() {

    const [courseData, setCourseData] = useState(
        { Title: "", Description: "", PriceInUSD: "", ImgURL: ""}
    )

    const [subtitles, setSubtitles] = useState([
        {subtitle: "", duration: ""},
        {subtitle: "", duration: ""}
    ])

    const [exercises, setExercises] = useState([""])

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

    function handleExercisesChange(index, event) {
        let data = [...exercises];
        data[index] = event.target.value;
        setExercises(data);
    }

    function checkSubmit() {
        //check all fields are filled
        let filled = true
        for (const field in courseData) {
            if (courseData[field] === "")
                filled = false
        }
        for (let i =0; i<subtitles.length; i++) {
            if (subtitles[i].title === "" || subtitles[i].duration === ""){
                filled = false
            }
        }
        for (let i =0; i<exercises.length; i++) {
            if (exercises[i]=== ""){
                filled = false
            }
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        return true;
    }

    function calcTotalHours(){
        let total = 0;
        for (let i =0; i<subtitles.length; i++) {
            total += (Number(subtitles[i].duration) / 60);
        }
        return total.toFixed(2);
    }

    function addSubtitle(){
        let newSubtitle = { subtitle: '', duration: '' }
        setSubtitles([...subtitles, newSubtitle])
    }

    function removeSubtitle(index){
        let data = [...subtitles];
        data.splice(index, 1)
        setSubtitles(data)
    }

    function addExercise(){
        let newExercise = "";
        setExercises([...exercises, newExercise])
    }

    function removeExercise(index){
        let data = [...exercises];
        data.splice(index, 1)
        setExercises(data)
    }

    async function handleSubmit(event) { 
        event.preventDefault();
        if (checkSubmit()) {
            let allCourseData = {
                ...courseData,
                TotalHours: calcTotalHours(),
                Subtitles: subtitles,
                Exercises: exercises,
                Subject: subject.value
            }
            return InstructorService.addCourse(allCourseData)
                .then((result) => {
                    setMessage({ text: `A new Course with title "${result.data.Title}" is added correctly`, type: "form--successmessage" })
                    setCourseData({Title: "", Description: "", PriceInUSD: "", ImgURL: ""})
                    setSubtitles([
                        {subtitle: "", duration: ""},
                        {subtitle: "", duration: ""}
                    ])
                    setExercises([""])
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    return (
        <>
            <Header />
            <div className="form--div">
                    <h1>Add Course</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Title"
                        onChange={handleChange}
                        name="Title"
                        value={courseData.Title}
                        style={{"width":"100%"}}
                    />
                    {subtitles.map((input, index) => {
                        return(
                            <div key={index} className="dynamic-form--div">
                                <input
                                    type="text"
                                    placeholder="Enter Subtitle"
                                    onChange={event => handleSubtitlesChange(index, event)}
                                    name="subtitle"
                                    value={input.subtitle}
                                />
                                <input
                                    type="number"
                                    placeholder="Enter Duration (in mins)"
                                    onChange={event => handleSubtitlesChange(index, event)}
                                    name="duration"
                                    value={input.duration}
                                />      
                                {subtitles.length>1 && <button type="button" className="dynamic-form--removebtn" onClick={() => removeSubtitle(index)}>Remove</button>}
                            </div>
                        )
                    })}
                    <button type="button" className="form--button" onClick={addSubtitle}>+ Add Subtitle</button>
                    <Select placeholder="Select Subject" classNamePrefix="react-select" className='react-select-container' options={options} value={subject} onChange={changeSubject} />
                    <input
                        type="text"
                        placeholder="Enter Description"
                        onChange={handleChange}
                        name="Description"
                        value={courseData.Description}
                        style={{"width":"100%"}}
                    />
                    <input
                        type="number"
                        placeholder="Enter Price in USD"
                        onChange={handleChange}
                        name="PriceInUSD"
                        value={courseData.PriceInUSD}
                        style={{"width":"100%"}}
                    />
                    {exercises.map((input, index) => {
                        return(
                            <div key={index} className="dynamic-form--Exercisediv">
                                <input
                                    type="text"
                                    placeholder="Enter Exercise"
                                    onChange={event => handleExercisesChange(index, event)}
                                    name="exercise"
                                    value={input}
                                />    
                                {<button type="button" className="dynamic-form--removebtn" onClick={() => removeExercise(index)}>Remove</button>}
                            </div>
                        )
                    })}
                    <button type="button" className="form--button" onClick={addExercise}>+ Add Exercise</button>
                    <input
                        type="text"
                        placeholder="Enter Image URL"
                        onChange={handleChange}
                        name="ImgURL"
                        value={courseData.ImgURL}
                        style={{"width":"100%"}}
                    />
                    <button type="submit" className="form--button">Submit</button>
                    <p className={message.type}>{message.text}</p>
                </ form>
            </div>
           
        </>
    )
}

export default LoginPage;
