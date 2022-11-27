import React from "react";
import { useParams } from "react-router-dom";
import CourseService from "../../services/Course.service";
import Header from "../Header/Header";
import Question from "../Question/Question";

async function retrieveExercise(courseId, exerciseNum){
    return CourseService.getExercise(courseId, exerciseNum)
    .then((result) => {
        return result;
    })
}

function ExercisePage() {
    const params = useParams();
    const [exercise, setExercise] = React.useState(null);

    React.useEffect(() => {
        document.title = "Exercise " + params.exerciseNum;
        retrieveExercise(params.courseId, params.exerciseNum)
        .then(exercise => {
            setExercise(exercise.data)
        })
        .catch((error) => {
            console.log(error);
        })
    }, [params.courseId, params.exerciseNum]);

    const exerciseQuestions = exercise?.questions.map((question, index) => {
        return (
            <Question 
                key={index}
                questionTitle={question.question}
                questionChoices ={question.choices}
            />
        )
    })

    return (
        <>
            <Header />
            <h1>{exercise?.exerciseName}</h1>
            {exerciseQuestions}
        </>
    )
}

export default ExercisePage;