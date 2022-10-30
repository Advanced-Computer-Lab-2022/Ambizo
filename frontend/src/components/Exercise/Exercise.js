import React from "react";
import ExerciseIcon from "../../images/ExerciseIcon.png";

function Exercise() {
    return (
        <div className="exercise">
            <img src={ExerciseIcon} alt="Exercise" className="exerice--icon" />
            <p className="exercise--title">Languages and Data Types</p>
        </div>
    )
}

export default Exercise;