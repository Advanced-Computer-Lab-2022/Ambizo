import React from "react";
import ExerciseIcon from "../../images/ExerciseIcon.png";

function Exercise(props) {
    return (
        <div className="exercise">
            <img src={ExerciseIcon} alt="Exercise" className="exerice--icon" />
            <p className="exercise--title">{props.exerciseTitle}</p>
        </div>
    )
}

export default Exercise;