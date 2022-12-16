import React, { useState } from "react";
import Header from "../Header/Header.js"
import {useNavigate } from "react-router-dom"
import SignUpSuccessfulPopup from "../SignUpSuccessfulPopUp/SignUpSuccessfulPopUp.js"
import SignUpService from "../../services/SignUp.service.js";


function SignUpPage(){

    const[userName, setUserName] = useState("error")

    const[userData, setUserData] = useState({
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        gender: "",
        showPassword: false,
        acceptedPolicies: false
})


const [message, setMessage] = useState(
    { text: "", type: ""}
)

const [conditional, setConditional] = useState(false)

const [PopUp, setPopUp] = useState(false)

console.log(PopUp)

const navigate = useNavigate();

function toggleConditional(){
    setConditional((prevCondition) => !prevCondition)
}

function togglePopUp(){
    setPopUp((popUp) => !popUp)
}

const NavigateToLogin = () => {
    navigate("/login");
}

function handleChange(event) {
    const { name, value, type, checked } = event.target
    setUserData(prevUserData => ({
        ...prevUserData,
        [name]: type === "checkbox" ? checked : value
    }))
}

function checkSubmit() {
    //check all fields are filled
    let filled = true
    for (const field in userData) {
        if (userData[field] === "")
            filled = false
    }
    if (!filled) {
        setMessage({ text: "All fields are required", type: "form--errormessage" })
        return false;
    }
    //check passwords match
    let passwordNoMatch = !(userData.password === userData.confirmPassword)
    if (passwordNoMatch) {
        setMessage({ text: "The passwords you entered do not match.", type: "form--errormessage" })
        setUserData(prevData => {
            return { ...prevData}
        })
        return false;
    }
    //check all password requirements
    let passwordlength = userData.password.length
    let checkRequirements = () => {
        let requirments = [false, false, false, false];   //[capital, small, number, symbol]
        let count = 0;
        for (var i = 0; i < userData.password.length; i++) {
            let character = userData.password[i];
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
        setMessage(
            { text: "Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols.", type: "form--errormessage" }
        )
        return false;
    }
    return true;
}

async function handleSubmit(event) {
    event.preventDefault();
    if(!userData.acceptedPolicies){
        setMessage({ text: "You must accept the Terms and Conditions to SignUp", type: "form--errormessage" })
        return
    }
    if (checkSubmit()) {
        try{
        return SignUpService.addIndividualTrainee(userData)
            .then((result) => {
                setMessage({ text: `A new Trainee with Username "${result.data.Username}" successfully added`, type: "form--successmessage" })
                togglePopUp()
                setUserName(result.data.Username)
                setUserData({ firstName: "", lastName: "", userName: "", password: "", confirmPassword: "", email: "", gender: "", showPassword:false })
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
            })
    }
    catch(err){
        console.log(err)
    }
}
}

    return(
        <>

            <SignUpSuccessfulPopup handleNavigateLogin={NavigateToLogin} popUp={PopUp} togglePopUp={togglePopUp} userName={userName} message={message}/>

            <Header />
            {!conditional &&
            <div className="signUpForm--div">
                <h1 className="signUp--title">Sign Up</h1>
                <form className="signUp--form" onSubmit={handleSubmit}>
                    <input 
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                    name="email"
                    value={userData.email}
                    />
                    <input 
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    name="userName"
                    value={userData.userName}
                    />
                    <input 
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange}
                    name="firstName"
                    value={userData.firstName}
                    />
                    <input 
                    type="text"
                    placeholder="Last Name"
                    onChange={handleChange}
                    name="lastName"
                    value={userData.lastName}
                    />
                    <input 
                    type={userData.showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleChange}
                    name="password"
                    value={userData.password}
                    />
                    <input 
                    type={userData.showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    />
                    <div className="show-password-div">
                        <input className="showpassword--checkbox"
                            type="checkbox"
                            id="showPassword"
                            checked={userData.showPassword}
                            onChange={handleChange}
                            name="showPassword"
                        />
                        <label htmlFor="showPassword">Show Passwords</label>
                    </div>
                    <h2 className = "gender--title"> Gender: </h2>

                    <div className="gender-select">
                        <div>
                            <input
                                type="radio"
                                id="male"
                                value="Male"
                                checked={userData.gender === "Male"}
                                onChange={handleChange}
                                name="gender"
                            />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="female"
                                value="Female"
                                checked={userData.gender === "Female"}
                                onChange={handleChange}
                                name="gender"
                            />
                            <label htmlFor="female">Female</label>
                        </div>
                        </div>
                    <button className="next--button" onClick={toggleConditional}>Next</button>
                    <p className={message.type}>{message.text}</p>
                </form>
            </div>}
            {conditional &&
            <div className="Terms--and--conditions" >
                <h1 className="TAC--title">Terms and Conditions</h1>
                <p className="TAC--text"> Ana Terms and conditions ya basha. Enta kda kda msh hate2rany fa 5od. Bas 5aly balak ana gowaya fa5. Haklak yaaad </p>
                <input className="TAC--checkbox"
                    type="checkbox"
                    id="TAC"
                    checked={userData.acceptedPolicies}
                    onChange={handleChange}
                    name="acceptedPolicies"
                />
                <label className="TAC--label" htmlFor="TAC">Accept Terms and Conditions</label>
                <div className="TAC-buttons">
                    <button className="back--button" onClick={toggleConditional}>Back</button>
                    <button className="signUp--button" onClick={handleSubmit}>Sign Up</button>
                </div>
                <p className={message.type}>{message.text}</p>
            </div>
            }
        </>
    )
}

export default SignUpPage