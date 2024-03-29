import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header.js"
import LoginService from "../../services/Login.service";
import ResetImage from "../../images/ResetImage.svg"
import ResetSentImage from "../../images/ResetSentImage.svg"

const windowState ={
    REQUESTING_RESET: 1,
    LOADING: 2,
    EMAIL_SENT: 3,
    WRONG_USERNAME: 4,
    INTERNAL_ERROR: 5
}

function formatEmailAddress(email){

    const [beforeAt, afterAt] = email.split('@');
    const charArray = beforeAt.split('');
    return charArray.map((char, index, string) => {
        if(string.length <= 3){
            if(index === 0){
                return char;
            }
            return '*' ;
        }
        if(index < 3){
            return char;
        }
        return '*';
    }).join('') + `@${afterAt}`;
}

function RequestPasswordResetPage(){
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [componentState, setComponentState] = useState(windowState.REQUESTING_RESET)
    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = 'Reset Password';
    }, []);

    function handleChange(event){
        const { value } = event.target;
        setUsername( _ => value );
    }

    async function handleSubmit(event){
        event.preventDefault();
        if(username === ""){
            setErrorMessage(_ => "Username is required")
        }else{
            const userData = {
                username: username
            };
            setComponentState(_ => windowState.LOADING);
            LoginService.requestPasswordReset(userData)
            .then(response => {
                setComponentState(_ => windowState.EMAIL_SENT)
                if(response.status === 200){
                    setUserEmail(_ => response.data.emailSentTo);
                }else{
                    console.log(response.data.message);
                }
            })
            .catch(error => {
                if(error.response.status === 404){
                    setComponentState(_ => windowState.WRONG_USERNAME);
                    setErrorMessage("The username provided is invalid")
                }else if (error.response.status === 500){
                    setComponentState(_ => windowState.INTERNAL_ERROR);
                }
                console.log(error);
            });

        }
    }
    switch(componentState){
        case windowState.LOADING:
        case windowState.REQUESTING_RESET:
        case windowState.WRONG_USERNAME:
            return (
                <>
                    { componentState === windowState.LOADING &&
                        <div className="loader-container">
                            <div className="spinner"> </div>
                        </div>
                    }
                    <Header />
                    <div className="form--container">
                        <div className="form--leftcontainer">
                            <h1 className="form--header">Reset Password</h1>
                            <form className="form--form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Enter your User Name"
                                    onChange={handleChange}
                                    name="username"
                                    value={username}
                                    className="form--inputfield"
                                />
                                <p className="form--errormessage">{errorMessage}</p>
                                <button className="form--submitbutton">Submit</button>
                            </form>
                        </div>
                        <div className='form--rightcontainer'>
                            <img className="form--loginimage" src={ResetImage} alt='Reset' />
                        </div>
                    </div>
                </>
            );
        case windowState.EMAIL_SENT:
            return (
                <>
                    <Header />
                    <div className="form--leftcontainer changesuccess">
                        <div>
                            <img className="success--image" src={ResetSentImage} alt='Success' />
                            <h2>Reset Email Sent</h2>
                            <p>An email was sent to this address ({formatEmailAddress(userEmail)}) containing a link to reset the password. 
                        If you can't find the email, Please check your spam and trash sections.</p>
                        </div>
                    </div>
                </>
            );
        case windowState.INTERNAL_ERROR:
            return (
                <>
                    <Header />
                    <div className="form--div" style={{"padding": "0 10px"}}>
                        <h3>Internal Error</h3>
                        <p>
                            An error has occured while processing your password reset request.
                             Please try again later. <span className="reset-password" onClick={() => navigate("/requestPasswordReset")}>Try Again</span>.
                        </p>
                    </div>
                </>

            );
        default:
            return <h1>Something went Wrong</h1>
    }
}

export default RequestPasswordResetPage;