import React, {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import Question from "../Question/Question";
import InstructorService from "../../services/Instructor.service";
import CourseService from "../../services/Course.service";
import AddExerciseImage from '../../images/AddExercise.svg'

function AddExercise() {
    const params = useParams();
    let navigate = useNavigate();
    const [exerciseName, setExerciseName] = useState("")
    const [questions, setQuestions] = useState([
        {question: "", answer: "", firstChoice: "", secondChoice: "", thirdChoice: "", fourthChoice: ""}
    ])
    const [message, setMessage] = useState(
        { text: "", type: ""}
    )
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [subtitleName, setSubtitleName] = React.useState("");
    const [courseName, setCourseName] = React.useState("");

    React.useEffect(() => {
        document.title = "Add Exercise";
        CourseService.getSubtitleName(params.courseId, params.exerciseNum)
        .then(res => {
            setSubtitleName(res.data.subtitleName)
            setCourseName(res.data.courseName)
            })
        .catch(() => {
            navigate("/404")
        })
    }, [params.courseId, params.exerciseNum, navigate]);

    function getAnswerNumber(answer){
        switch(answer.trim()){
            case 'a' : case 'A': return 0;
            case 'b' : case 'B': return 1;
            case 'c' : case 'C': return 2;
            case 'd' : case 'D': return 3;
            default: return 4;
        }
    }

    async function handleSubmit(event) { 
        event.preventDefault();
        if (checkSubmit()) {
            let questionsFormatted = [];
            questions.forEach((question, index) => {
                questionsFormatted[index] = {
                    question: question.question,
                    answer: getAnswerNumber(question.answer) + "",
                    choices: [question.firstChoice, question.secondChoice, question.thirdChoice, question.fourthChoice]
                }
            })
            let allExerciseData = {
                exerciseName: exerciseName,
                questions: questionsFormatted
            }
            return InstructorService.addExercise(params.courseId, params.exerciseNum, allExerciseData)
                .then((result) => {
                    setMessage({ text: `A new Exercise with title "${result.data.exerciseName}" is added correctly for the subtitle ${subtitleName}`, type: "form--successmessage" })
                    setExerciseName("")
                    setQuestions([
                        {question: "", answer: "", firstChoice: "", secondChoice: "", thirdChoice: "", fourthChoice: ""}
                    ])
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    function checkSubmit() {
        let filled = true
        let correctAnswer = true;
        if(exerciseName.trim()===""){
            filled=false;
        }
        for (let i =0; i<questions.length; i++) {
            if (questions[i].question === "" || 
            questions[i].answer === "" ||
            questions[i].firstChoice === "" ||
            questions[i].secondChoice === "" ||
            questions[i].thirdChoice === "" ||
            questions[i].fourthChoice === ""){
                filled = false
            }
            if((getAnswerNumber(questions[i].answer)+1) > 4 || (getAnswerNumber(questions[i].answer)+1) < 1){
                correctAnswer = false;
            }
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        if(!correctAnswer){
            setMessage({ text: "Correct Answer must be A, B, C or D", type: "form--errormessage" })
            return false;
        }
        return true;
    }

    function handleChange(event){
        const { value } = event.target;
        setExerciseName(value);
    }

    function handleQuestionsChange(index, event) {
        let data = [...questions];
        data[index][event.target.name] = event.target.value;
        setQuestions(data);
    }

    function addQuestion(){
        let newQuestion = {question: "", answer: "", firstChoice: "", secondChoice: "", thirdChoice: "", fourthChoice: ""}
        setQuestions([...questions, newQuestion])
    }

    function removeQuestion(index){
        let data = [...questions];
        data.splice(index, 1)
        setQuestions(data)
    }

    const exerciseQuestions = questions.map((question, index) => {

        return (
            <Question 
                key={index}
                questionTitle={question.question}
                questionChoices ={[question.firstChoice, question.secondChoice, question.thirdChoice, question.fourthChoice]}
                questionNum = {index}
                isHidden={currentQuestion !== index}
                checked = {getAnswerNumber(question.answer) + ""}
                handleChoiceClick = {(event) => null}
                preview= {true}
            />
        )
    })
    
    const navigationBoxes = questions.map((question, index) => {

        return (
            <div 
            key={index}
            className={"examNav--boxes--box" + 
            (index===currentQuestion? " current" : " notCurrent") +
            (question.answer? " solved" : "")}
            onClick={() => setCurrentQuestion(index)}
            >
                <p>{index+1}</p>
            </div>
        )
    })

    function handleButtonClick(event){
        const {name} = event.target;
        if(name ==="previous"){
            setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion-1);
        }
        else{
            setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion+1);
        }
    }

    return (
        <>
            <Header />
            <div className="adminpromo--headerdiv">
                <div>
                    <h1 className="adminpromotions--header">Create New Exercise</h1>
                    <h2 className="addExercise--subheader">For course: <span className="addExercise--subheader--subtitle">{courseName}</span></h2>
                    <h2 className="addExercise--subheader">For subtitle: <span className="addExercise--subheader--subtitle">{subtitleName}</span></h2>
                </div>
                <img className="addExercise--image" src={AddExerciseImage} alt='Prices' />
            </div>
            <p className="addExercise--goback" onClick={() => navigate(`/coursedetails/${params.courseId}`)}>{"<"} Back to Course details</p>
            <div className="addExercise--container">
                <div className="addExercise--leftcontainer">
                    <h1 className="addCourse--header">Add Exercise</h1>
                    <form className="addCourse--form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Exercise Title"
                            onChange={handleChange}
                            name="exerciseName"
                            className="addCourse--inputfield  title"
                            value={exerciseName}
                        />
                        {questions.map((input, index) => {
                            return(
                                <>
                                    {index !==0 && <hr className="question--line"/>}
                                    <h2 className="addExercise--questionHeader">{"Question " + (index+1)}</h2>
                                    <div key={(index+1)*-1} className="dynamic-form--div">
                                        <input
                                            type="text"
                                            placeholder={"Enter Question " + (index+1) + " Title"}
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="question"
                                            className="addCourse--inputfield questionTitle"
                                            value={input.question}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter Correct Answer (A-D)"
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="answer"
                                            maxLength={1}
                                            className={"addCourse--inputfield correctAnswer" + (input.answer !== ""? " filled" : "")}
                                            value={input.answer}
                                        /> 
                                        {questions.length>1 && <i className="fa-solid fa-square-xmark removeSubtitle" onClick={() => removeQuestion(index)}></i>}

                                    </div>
                                    <div key={index} className="dynamic-form--div choices">
                                        <input
                                            type="text"
                                            placeholder="Enter Choice A"
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="firstChoice"
                                            className="addCourse--inputfield"
                                            value={input.firstChoice}
                                        />     
                                        <input
                                            type="text"
                                            placeholder="Enter Choice B"
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="secondChoice"
                                            className="addCourse--inputfield"
                                            value={input.secondChoice}
                                        />      
                                        <input
                                            type="text"
                                            placeholder="Enter Choice C"
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="thirdChoice"
                                            className="addCourse--inputfield"
                                            value={input.thirdChoice}
                                        />      
                                        <input
                                            type="text"
                                            placeholder="Enter Choice D"
                                            onChange={event => handleQuestionsChange(index, event)}
                                            name="fourthChoice"
                                            className="addCourse--inputfield"
                                            value={input.fourthChoice}
                                        />           
                                    </div>
                                </>
                            )
                        })}
                        <button type="button" className="form--button" onClick={addQuestion}>+ Add Question</button>
                        <div className="form--buttons--div exerciseForm">
                            <button type="submit" className="addCourse--button">Submit</button>
                        </div>
                        <p className={message.type}>{message.text}</p>
                    </form>
                </div>
                <div className='addExercise--rightcontainer'>
                    <h1 className="addCourse--header preview">Exercise Preview</h1>
                    <div className="exercise--preview--div">
                        <p className="exercisePage--title preview">{exerciseName}</p>
                        <div className="exercise--div">
                            {exerciseQuestions}
                            <div className="examNav--div preview">
                                <div className="examNav--title--div">
                                    <p className="examNav--title">Quiz Navigation</p>
                                </div>
                                <div className="examNav--boxes">
                                    {navigationBoxes}
                                </div>
                            </div>
                        </div>
                        <p className="question--number--tag">{"Question " + (currentQuestion+1) +" Of " + questions.length }</p>
                        <div className="form--buttons--div">
                            <button 
                                type="button" 
                                name="previous" 
                                className="form--button previous" 
                                disabled={currentQuestion === 0} 
                                onClick={handleButtonClick} 
                            >
                                &lt; Previous
                            </button>
                            <button 
                                type="button" 
                                name="next"
                                disabled={currentQuestion === questions.length-1}  
                                className={"form--button next"} 
                                onClick={handleButtonClick}
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddExercise;