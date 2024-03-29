import React, { useState } from "react";
import Header from "../Header/Header.js"
import {useNavigate } from "react-router-dom"
import SignUpSuccessfulModal from "../SignUpSuccessfulModal/SignUpSuccessfulModal.js"
import SignUpService from "../../services/SignUp.service.js";
import SignUpImage from "../../images/SignUpImage.svg";


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

const [firstPage, setFirstPage] = useState(true)

const [secondPage, setSecondPage] = useState(false)

const navigate = useNavigate();

React.useEffect(() => {
    document.title = "Sign up";
    if(sessionStorage.getItem("Token")){
        navigate("/")
    }
}, []);

function toggleConditional(){
    setConditional((prevCondition) => !prevCondition)
}

function toggleFirstPage(){
    setFirstPage((prevCondition) => !prevCondition)
}

function toggleSecondPage(){
    setSecondPage((prevCondition) => !prevCondition)
}

function togglePopUp(){
    setPopUp((popUp) => !popUp)
}

function goToSecondPage(){
    toggleFirstPage()
    toggleSecondPage()
}

function goToFirstPage(){
    toggleFirstPage()
    toggleSecondPage()
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
                setUserData({ firstName: "", lastName: "", userName: "", password: "", confirmPassword: "", email: "", gender: "", showPassword:false, acceptedPolicies: false })
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
            })
    }
    catch(err){
        console.log(err)
    }
}
    else{
        setConditional(false)
        goToFirstPage()
    }
}

    return(
        <>

            <SignUpSuccessfulModal handleNavigateLogin={NavigateToLogin} popUp={PopUp} togglePopUp={togglePopUp} userName={userName} message={message}/>

            <Header />
            {!conditional &&
            <div className="form--container">
                <div className="form--leftcontainer">
                    <h1 className="form--header">Sign Up</h1>
                    <form className="form--form" onSubmit={handleSubmit}>
                        {firstPage &&
                        <>
                            <input 
                            type="text"
                            placeholder="Email"
                            onChange={handleChange}
                            name="email"
                            value={userData.email}
                            className="form--inputfield"
                            />
                            
                            <input 
                            type="text"
                            placeholder="Username"
                            onChange={handleChange}
                            name="userName"
                            value={userData.userName}
                            className="form--inputfield"
                            />

                            <input 
                            type={userData.showPassword ? "text" : "password"}
                            placeholder="Password"
                            onChange={handleChange}
                            name="password"
                            value={userData.password}
                            className="form--inputfield"
                            />
                            
                            <input 
                            type={userData.showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            name="confirmPassword"
                            value={userData.confirmPassword}
                            className="form--inputfield"
                            />
                        
                            <button className="next--button" onClick={goToSecondPage}>Next</button>

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

                            <div className="login--forgotpassword">
                                <div>
                                    <p className="donthaveaccount">Already have an account? <span onClick={() => navigate("/login")} className="reset-password">Log in</span>.</p>
                                </div>
                            </div>
                        </>
                        }
                        {secondPage &&
                        <>
                            <input 
                            type="text"
                            placeholder="First Name"
                            onChange={handleChange}
                            name="firstName"
                            value={userData.firstName}
                            className="form--inputfield"
                            />

                            <input 
                            type="text"
                            placeholder="Last Name"
                            onChange={handleChange}
                            name="lastName"
                            value={userData.lastName}
                            className="form--inputfield"
                            />
                        
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
                            <button className="secondPageBack--button" onClick={goToFirstPage}>Back</button>
                        </>
                    }
                    </form>                 
                    {message.text !== "" && <p className={message.type}>{message.text}</p>}
                </div>
                <div className='form--rightcontainer'>
                    <img className="form--loginimage" src={SignUpImage} alt='SignUp' />
                </div>
            </div>}
            {conditional &&
            <div className="tcdiv">
                <div className="Terms--and--conditions" >
                    <h1 className="TAC--title">Terms and Conditions</h1>
                    <p className="TAC--text">Lorem ipsum dolor sit amet. Rem autem eveniet qui suscipit libero sit optio laboriosam et ratione voluptatem. Cum necessitatibus possimus aut nobis repudiandae non sapiente voluptatem et minus velit eum omnis praesentium. Hic nulla velit et quod quibusdam ut neque voluptate et rerum itaque ut voluptatem praesentium. Hic tenetur temporibus cum voluptatem ratione nam molestiae sapiente in recusandae amet ab neque sint ut molestiae quae 33 quia laborum. Quo facere repellendus ut autem natus est quas quia.</p>
                    <input className="TAC--checkbox"
                        type="checkbox"
                        id="TAC"
                        checked={userData.acceptedPolicies}
                        onChange={handleChange}
                        name="acceptedPolicies"
                    />
                    <label className="TAC--label" htmlFor="TAC">Accept Terms and Conditions</label>
                    <div className="TAC-buttons">
                        <button className="next--button" onClick={handleSubmit}>Sign Up</button>
                        <button className="secondPageBack--button" onClick={toggleConditional}>Back</button>
                    </div>
                    {message.text !== "" && <p className={message.type}>{message.text}</p>}
                </div>
            </div>
            }
        </>
    )
}

export default SignUpPage