import React from "react";

function Question(props) {

    return(
        <>
            <h1>{props.questionTitle}</h1>
            <h2>{props.questionChoices[0]}</h2>
            <h2>{props.questionChoices[1]}</h2>
            <h2>{props.questionChoices[2]}</h2>
            <h2>{props.questionChoices[3]}</h2>
        </>
    )
}

export default Question;