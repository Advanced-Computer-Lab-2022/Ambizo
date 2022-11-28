import React from "react";
import { useParams } from "react-router-dom";
import CourseService from "../../services/Course.service";
import Header from "../Header/Header";
import Question from "../Question/Question";
import TraineeService from "../../services/Trainee.service";

async function retrieveExercise(courseId, exerciseNum){
    return CourseService.getExercise(courseId, exerciseNum)
    .then((result) => {
        return result;
    })
}

function ExercisePage() {
    const params = useParams();
    const [exercise, setExercise] = React.useState(null);
    const [traineeChoices, setTraineeChoices] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(0);

    React.useEffect(() => {
        document.title = "Exercise " + (Number.parseInt(params.exerciseNum)+1);
        retrieveExercise(params.courseId, params.exerciseNum)
        .then(exercise => {
            setExercise(exercise.data)
        })
        .catch((error) => {
            console.log(error);
        })
    }, [params.courseId, params.exerciseNum]);

    function handleChoiceClick(event, index){
        const {value} = event.target;
        let newTraineeChoices = [...traineeChoices];
        newTraineeChoices[index] = value;
        setTraineeChoices(newTraineeChoices);
    }

    function handleButtonClick(event){
        const {name} = event.target;
        if(name ==="previous"){
            setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion-1);
        }
        else{
            setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion+1);
        }
    }

    async function handleSubmit(event){
        event.preventDefault();
        return TraineeService.submitExercise(params.courseId, params.exerciseNum, traineeChoices)
            .then((result) => {
                console.log(result);
                return null;
            })
            .catch((error) => {
                console.log(error);
                return null;
            })
    }

    const exerciseQuestions = exercise?.questions.map((question, index) => {

        return (
            <Question 
                key={index}
                questionTitle={question.question}
                questionChoices ={question.choices}
                questionNum = {index}
                isHidden={currentQuestion !== index}
                checked = {traineeChoices[index]}
                handleChoiceClick = {(event) => handleChoiceClick(event, index)}
            />
        )
    })
    
    const navigationBoxes = exercise?.questions.map((question, index) => {

        return (
            <div 
            key={index}
            className={"examNav--boxes--box" + 
            (index===currentQuestion? " current" : " notCurrent") +
            (traineeChoices[index]? " solved" : "")}
            onClick={() => setCurrentQuestion(index)}
            >
                <p>{index+1}</p>
            </div>
        )
    })

    return (
        <>
            <Header />
            <p className="exercisePage--title">{exercise?.exerciseName}</p>
            <div className="exercise--div">
                {exerciseQuestions}
                <div className="examNav--div">
                    <div className="examNav--title--div">
                        <p className="examNav--title">Quiz Navigation</p>
                    </div>
                    <div className="examNav--boxes">
                        {navigationBoxes}
                    </div>
                    <button 
                    type="button" 
                    className={"form--button finish navigation"} 
                    onClick={handleSubmit}
                >
                    Submit Answers
                </button>
                </div>
            </div>
            <p className="question--number--tag">{"Question " + (currentQuestion+1) +" Of " + exercise?.questions.length }</p>
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
                    disabled={currentQuestion === exercise?.questions.length-1}  
                    className={"form--button next"} 
                    onClick={handleButtonClick}
                >
                    Next &gt;
                </button>
            </div>
        </>
    )
}

export default ExercisePage;