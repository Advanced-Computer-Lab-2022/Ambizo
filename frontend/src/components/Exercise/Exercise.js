import React from "react";
import { useNavigate } from "react-router-dom";
import ExerciseIcon from "../../images/ExerciseIcon.png";

function handleExerciseClick(navigate, link){
    const type = sessionStorage.getItem("Type");
    if(type === "individualTrainee" || type === "corporateTrainee"){
        navigate(link);
    }
}

function Exercise(props) {
    const exerciseLink = "/exercise/" + props.courseId + "/" + props.exerciseNum;
    const navigate = useNavigate();

    return (
        <div className="exercise" onClick={() => handleExerciseClick(navigate, exerciseLink)}>
            <img src={ExerciseIcon} alt="Exercise" className="exerice--icon" />
            <p className="exercise--title">{props.exerciseTitle}</p>
        </div>
    )
}

export default Exercise;