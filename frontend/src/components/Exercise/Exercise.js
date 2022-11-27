import React from "react";
import { useNavigate } from "react-router-dom";
import ExerciseIcon from "../../images/ExerciseIcon.png";

function Exercise(props) {
    const exerciseLink = "/exercise/" + props.courseId + "/" + props.exerciseNum;
    const navigate = useNavigate();

    return (
        <div className="exercise" onClick={() => navigate(exerciseLink)}>
            <img src={ExerciseIcon} alt="Exercise" className="exerice--icon" />
            <p className="exercise--title">{props.exerciseTitle}</p>
        </div>
    )
}

export default Exercise;