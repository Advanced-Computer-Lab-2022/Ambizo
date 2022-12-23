import React from "react";
import iconA from "../../images/A-icon.png";
import iconB from "../../images/B-icon.png";
import iconC from "../../images/C-icon.png";
import iconD from "../../images/D-icon.png";

function Question(props) {

    return(
        <>
            <div className={"question--container"+ (props.preview? " preview" : "")} hidden={props.isHidden}>
        
                <div className="question--title--div">
                    <p className="question--title">{props.questionTitle}</p>
                </div>
            

                <label className={"question--choice" + (props.isFinished ? (props.correctAnswer === "0" ? " correct" : " wrong") : "") + (props.checked === "0" ? " checked" : "") +
                    (props.preview ? " preview" : "")}>
                    <img src={iconA} alt='Question A Icon' className='question--icon'/>
                    <input 
                        type="radio"
                        id={"question"+props.questionNum+"-firstChoice"}
                        name={"question"+props.questionNum+"-choice"}
                        value="0"
                        checked={props.checked === "0"}
                        onChange={props.handleChoiceClick}
                    />
                    <div className="question--choice--text">{props.questionChoices[0]}</div>
                    {props.isFinished && props.correctAnswer === "0" && props.checked === "0" && <i className="fa-solid fa-circle-check question--choice--icon correct"></i>}
                    {props.isFinished && props.correctAnswer !== "0" && props.checked === "0" && <i className="fa-solid fa-circle-xmark question--choice--icon wrong"></i>}
                </label>
                

                <label className={"question--choice" + (props.isFinished ? (props.correctAnswer === "1" ? " correct" : " wrong") : "") + (props.checked === "1" ? " checked" : "") +
                    (props.preview ? " preview" : "")}>
                    <img src={iconB} alt='Question B Icon' className='question--icon'/>
                    <input 
                        type="radio"
                        id={"question"+props.questionNum+"-secondChoice"}
                        name={"question"+props.questionNum+"-choice"}
                        value="1"
                        checked={props.checked === "1"}
                        onChange={props.handleChoiceClick}
                    />
                    <div className="question--choice--text">{props.questionChoices[1]}</div>
                    {props.isFinished && props.correctAnswer === "1" && props.checked === "1" && <i className="fa-solid fa-circle-check question--choice--icon correct"></i>}
                    {props.isFinished && props.correctAnswer !== "1" && props.checked === "1" && <i className="fa-solid fa-circle-xmark question--choice--icon wrong"></i>}
                </label>

                <label className={"question--choice" + (props.isFinished ? (props.correctAnswer === "2" ? " correct" : " wrong") : "") + (props.checked === "2" ? " checked" : "") +
                    (props.preview ? " preview" : "")}>
                    <img src={iconC} alt='Question C Icon' className='question--icon'/>
                    <input 
                        type="radio"
                        id={"question"+props.questionNum+"-thirdChoice"}
                        name={"question"+props.questionNum+"-choice"}
                        value={"2"}
                        checked={props.checked === "2"}
                        onChange={props.handleChoiceClick}
                    />
                    <div className="question--choice--text">{props.questionChoices[2]}</div>
                    {props.isFinished && props.correctAnswer === "2" && props.checked === "2" && <i className="fa-solid fa-circle-check question--choice--icon correct"></i>}
                    {props.isFinished && props.correctAnswer !== "2" && props.checked === "2" && <i className="fa-solid fa-circle-xmark question--choice--icon wrong"></i>}
                </label>

                <label className={"question--choice" + (props.isFinished ? (props.correctAnswer === "3" ? " correct" : " wrong") : "") + (props.checked === "3" ? " checked" : "") +
                    (props.preview ? " preview" : "")}>
                    <img src={iconD} alt='Question D Icon' className='question--icon'/>
                    <input 
                        type="radio"
                        id={"question"+props.questionNum+"-fourthChoice"}
                        name={"question"+props.questionNum+"-choice"}
                        value={"3"}
                        checked={props.checked === "3"}
                        onChange={props.handleChoiceClick}
                    />
                    <div className="question--choice--text">{props.questionChoices[3]}</div>
                    {props.isFinished && props.correctAnswer === "3" && props.checked === "3" && <i className="fa-solid fa-circle-check question--choice--icon correct"></i>}
                    {props.isFinished && props.correctAnswer !== "3" && props.checked === "3" && <i className="fa-solid fa-circle-xmark question--choice--icon wrong"></i>}
                </label>
            </div>
        </>
    )
}

export default Question;