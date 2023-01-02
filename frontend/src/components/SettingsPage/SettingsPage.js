import React , { useState, useEffect} from "react";
import Header from "../Header/Header";
import LoginService from "../../services/Login.service";
import PasswordSuccess from '../../images/PasswordSuccess.svg'

function SettingsPage() {
    const [passwordData, setPasswordData] = useState(
        { oldPassword:'', newPassword: '', newPasswordConfirmation:'', showpassword: false }
    );
    
    const [messages, setMessages] = useState(
        { emptyFieldsMessage: '', passwordStrengthMessage: '', passwordMatchingMessage: '', passwordResetFailureMessage: '' }
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isPasswordReset, setIsPasswordReset] = useState(false);

    useEffect(() => {
        document.title = 'Settings & Privacy';
        setTimeout(() => {
            setIsLoading(false);
        }, 50);
    }, []);

    function handleChange(event){
        const { name, value, type, checked } = event.target
        setPasswordData(prevPasswordData => ({
            ...prevPasswordData,
            [name] : type === 'checkbox' ? checked: value
        }));
    }

    function checkSubmit(){
        setMessages(prevMessages => ({
            ...prevMessages,
            passwordResetFailureMessage: ''
        }));
        //check all fields are filled
        let filled = true
        for (const field in passwordData) {
            if (passwordData[field] === "")
                filled = false
        }
        setMessages(prevMessages => ({
            ...prevMessages,
            emptyFieldsMessage: !filled? 'All fields are required.' : ''
        }));

        if (!filled) {
            return false;
        }
        //check passwords match
        let passwordNoMatch = !(passwordData.newPassword === passwordData.newPasswordConfirmation)
        setMessages(prevMessages =>({
            ...prevMessages,
            passwordMatchingMessage: passwordNoMatch? 'The passwords you entered do not match.': ''
        }))
        if (passwordNoMatch) {
            setPasswordData(prevPasswordData => ({
                ...prevPasswordData,
                newPasswordConfirmation: ''
            }))
            return false;
        }
        //chech all password requirements
        let passwordlength = passwordData.newPassword.length
        let checkRequirements = () => {
            let requirments = [false, false, false, false];   //[cabital, small, number, symbol]
            let count = 0;
            for (var i = 0; i < passwordData.newPassword.length; i++) {
                let character = passwordData.newPassword[i];
                if (character >= 'A' && character <= 'Z') {
                    requirments[0] = true;
                }
                else if (character >= 'a' && character <= 'z') {
                    requirments[1] = true;
                }
                else if (character >= '0' && character <= '9') {
                    requirments[2] = true;
                }

                else {
                    requirments[3] = true;
                }
            }
            for (i = 0; i < requirments.length; i++) {
                if (requirments[i])
                    count++;
            }
            if (count >= 2)
                return true;
            return false;
        }

        let requirementsFullfilled = checkRequirements()
        if (passwordlength < 8 || !requirementsFullfilled) {
            setMessages(prevMessages => ({
                ...prevMessages,
                passwordStrengthMessage: 'Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols.'
            }))
            return false;
        }
        setMessages(prevMessages => ({...prevMessages, passwordStrengthMessage: ''}));
        return true;
    }

    async function handleSubmit(event){
        event.preventDefault();
        if(checkSubmit()){
            setIsLoading(_ => true);
            LoginService.changePassword(
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                },
            ).then(response => {
                setIsLoading(_ => false);
                if(response.status === 201){
                    setIsPasswordReset(_ => true);
                }else{
                    setMessages(prevMessages => ({
                        ...prevMessages,
                        passwordResetFailureMessage: 'An Error has occurred. Try Again.'
                    }));
                }
            })
            .catch(error =>{
                setIsLoading(_ => false);
                let errorMessage = 'An Error has occurred.\nTry Again later.';


                if(error.response.status === 403){
                    errorMessage = 'The old password provided is wrong.'
                }
                setMessages(prevMessages => ({
                    ...prevMessages,
                    passwordResetFailureMessage: errorMessage
                }));
                console.log(error);
            });
        }
    }     



    return (
        <>
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading?
                (
                    <Header />
                )
                :
                (
                    <>
                        <Header />
                        <div className="settingspage">
                            <div className="settingspage--leftcontainer">
                                <h1 className="settingspage--header"><i className="fa-solid fa-gear"></i>&nbsp;&nbsp;Settings</h1>  
                                <p className="settingspage--signinsecurity"><i className="fa-solid fa-lock"></i>&nbsp;&nbsp;Sign in & security</p>
                            </div>
                            <div className="settingspage--rightcontainer">
                            {
                            (!isPasswordReset)?
                            (
                                <div className="form--container">
                                    <div className="form--leftcontainer">
                                        <h1 className="form--header">Change your password</h1>
                                        <form className="form--form" onSubmit={handleSubmit}>
                                            <input
                                                type={passwordData.showpassword ? "text" : "password"}
                                                placeholder="Enter old Password"
                                                onChange={handleChange}
                                                name="oldPassword"
                                                value={passwordData.oldPassword}
                                                className="form--inputfield"
                                            />
                                            <input
                                                type={passwordData.showpassword ? "text" : "password"}
                                                placeholder="Enter new Password"
                                                onChange={handleChange}
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                className="form--inputfield"
                                            />
                                            <input
                                                type={passwordData.showpassword ? "text" : "password"}
                                                placeholder="Confirm new Password"
                                                onChange={handleChange}
                                                name="newPasswordConfirmation"
                                                value={passwordData.newPasswordConfirmation}
                                                className="form--inputfield"
                                            />
                                            <button className="form--submitbutton">Save Password</button>
                                            <div className="show-password-div">
                                                <input
                                                    type="checkbox"
                                                    id="showpassword"
                                                    checked={passwordData.showpassword}
                                                    onChange={handleChange}
                                                    name="showpassword"
                                                />
                                                <label htmlFor="showpassword">Show Password</label>
                                            </div>
                                            <p className='form--errormessage'>{messages.emptyFieldsMessage}</p>
                                            <p className='form--errormessage'>{messages.passwordResetFailureMessage}</p>
                                            <p className='form--errormessage'>{messages.passwordStrengthMessage}</p>
                                            <p className='form--errormessage'>{messages.passwordMatchingMessage}</p>
                                        </ form>
                                    </div>
                                </div>
                            ):
                            (
                                <div className="form--leftcontainer changesuccess">
                                    <div>
                                        <img className="success--image" src={PasswordSuccess} alt='Success' />
                                        <h2>Password Changed Successfully</h2>
                                        <p>You can now use your new password to log in to your account</p>
                                    </div>
                                </div>
                            )
                        }
                            </div>
                        </div>
                    </>
                )
            }
            
        </>
    )
}

export default SettingsPage;