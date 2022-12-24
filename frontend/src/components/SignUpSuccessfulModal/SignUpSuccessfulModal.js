import React from "react"
import XIcon from '../../images/XIcon.png';

 function SignUpSuccessfulModal(props){

    if(props.popUp) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
    }


    return (
        <>
        {props.popUp && 
            (
                <div className="contractPopup">
                    <div onClick={props.togglePopUp} className="overlay"></div>
                    <div className="modal-content-confirmation">
                        <img src={XIcon} alt='X Icon' className='x--icon'/>
                        <button className="close-modal" onClick={props.togglePopUp}></button>
                        <i className="fa-solid fa-circle-check checkIcon"></i>
                        <p className="signUpPopUp--message"> User with Username "{props.userName}" created successfully </p>
                        <div className="signUpPopUp--buttons">
                            <button className='button--goToLogin' onClick={props.handleNavigateLogin} > Go to Login </button>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default SignUpSuccessfulModal