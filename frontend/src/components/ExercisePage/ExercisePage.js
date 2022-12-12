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

async function retrieveAnswers(courseId, exerciseNum) {
    return TraineeService.getAnswers(courseId, exerciseNum)
        .then((result) => {
            return result;
        })
}

function ExercisePage() {
    const params = useParams();
    const [exercise, setExercise] = React.useState(null);
    const [traineeChoices, setTraineeChoices] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true); 
    const [grade, setGrade] = React.useState(-1);
    const [isSubmitted, setIsSubmitted] = React.useState(false); 

    React.useEffect(() => {
        document.title = "Exercise " + (Number.parseInt(params.exerciseNum)+1);
        setIsLoading(true);
        retrieveExercise(params.courseId, params.exerciseNum)
        .then(exercise => {
            setExercise(exercise.data)
        })
        .catch((error) => {
            console.log(error);
        })

        if(sessionStorage.getItem("Type") === "instructor"){
            setGrade(1);
            setIsLoading(false);
        }
        else{
            retrieveAnswers(params.courseId, params.exerciseNum)
            .then(answers => {
                if (answers.data?.grade > -1) {
                    setTraineeChoices(answers.data.choices);
                    setGrade(answers.data.grade);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [params.courseId, params.exerciseNum, isSubmitted]);



    function handleChoiceClick(event, index) {
        if (!(grade > -1)) {
            const { value } = event.target;
            let newTraineeChoices = [...traineeChoices];
            newTraineeChoices[index] = value;
            setTraineeChoices(newTraineeChoices);
        }
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

    function handleSubmit(event) {
        event.preventDefault();
        let NewTraineeChoices = [];
        for (let i = 0; i < exercise.questions.length; i++) {
            NewTraineeChoices.push(traineeChoices[i]?traineeChoices[i]:null);
        }
        setTraineeChoices(NewTraineeChoices);

        TraineeService.submitExercise(params.courseId, params.exerciseNum, NewTraineeChoices)
            .then(() => {
                setIsSubmitted(true);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const exerciseQuestions = exercise?.questions.map((question, index) => {

        return (
            <Question
                key={index}
                questionTitle={question.question}
                questionChoices={question.choices}
                questionNum={index}
                isHidden={currentQuestion !== index}
                checked={traineeChoices[index]}
                handleChoiceClick={(event) => handleChoiceClick(event, index)}
                isFinished={grade > -1}
                correctAnswer={exercise?.questions[index].answer}
                preview={false}
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
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading ?
            (
                <>
                    <Header />
                </>
            )
            :
            (
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
                            {!(grade > -1) &&
                            <button
                            type="button"
                            className={"form--button finish navigation"} 
                            onClick={handleSubmit}
                            >
                            Submit Answers
                            </button>
                            }
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
                    {sessionStorage.getItem("Type") !== "instructor" && (grade > -1) && <p className="exercise--grade">You got <b>{((grade * 100).toFixed(1) % 1) === 0 ? (grade * 100).toFixed(0) : (grade * 100).toFixed(1)}%</b> correct { grade < 0.5? "😞" : grade > 0.86?"😀🎉" : "😀"} </p>}
                
                </>
            )
            }
        </>
    )
}

export default ExercisePage;