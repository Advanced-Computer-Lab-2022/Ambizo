import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Header from "../Header/Header.js"
import LoginService from "../../services/Login.service";
import InstructorService from "../../services/Instructor.service";
import InstructorContractModal from "../InstructorContractModal/InstructorContractModal.js";
import LoginImage from '../../images/LoginImage.svg'

function LoginPage() {

    const [userData, setUserData] = useState(
        { username: "", password: "", showpassword: false}
    )

    const [message, setMessage] = useState(
        { text: "", type: ""}
    )

    const [contractModal, setContractModal] = React.useState(false);
    

    const navigate = useNavigate();
    
    React.useEffect(() => {
        document.title = "Login";
        if(sessionStorage.getItem("Token")){
            navigate("/")
        }
    }, []);
    
    function handleAcceptContract(){
        
        InstructorService.acceptContract()
        .then(() => {
            navigate("/mycourses");
        })
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    function checkSubmit() {
        let filled = true
        for (const field in userData) {
            if (userData[field] === "")
                filled = false
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }

        return true;
    }

    const toggleContractModal = () => {
        setContractModal(prevModal => !prevModal);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        if(checkSubmit()) {
            LoginService.login(userData)
            .then((tokenRes) => {
                sessionStorage.setItem("Token", tokenRes.data.token);
                LoginService.getLoggedInUserData()
                .then((userRes) => {
                    sessionStorage.setItem("User", JSON.stringify(userRes.data));
                    sessionStorage.setItem("Type", userRes.data.Type);
                    if(userRes.data.Type === "instructor"){
                        let isContractAccepted = null
                        InstructorService.isContractAccepted()
                        .then((contractRes) => {
                            isContractAccepted = contractRes.data.isAccepted
                        if(isContractAccepted){
                            navigate("/mycourses");
                        }
                        else{
                            toggleContractModal()
                        }
                        })
                        
                    }
                    else{
                        navigate("/");
                    }
                    
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
            })
        }
    }

    return (
        <>

            <InstructorContractModal toggleContractModal = {toggleContractModal} contractModal = {contractModal} handleAcceptContract = {handleAcceptContract}/>
            
            <Header />
            <div className="login--container">
                <div className="login--leftcontainer">
                    <h1 className="login--header">Log in to your account</h1>
                    <form className="login--form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            onChange={handleChange}
                            name="username"
                            value={userData.username}
                            className="login--inputfield"
                        />
                        <input
                            type={userData.showpassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={handleChange}
                            name="password"
                            value={userData.password}
                            className="login--inputfield"
                        />
                        <button className="loginform--button">Log in</button>
                        <div className="show-password-div">
                            <input
                                type="checkbox"
                                id="showpassword"
                                checked={userData.showpassword}
                                onChange={handleChange}
                                name="showpassword"
                            />
                            <label htmlFor="showpassword">Show Password</label>
                        </div>
                        <p>Forgotten password? <span onClick={() => navigate("/requestPasswordReset")} className="reset-password">Reset password</span>.</p>
                        
                        <p className={message.type}>{message.text}</p>
                    </ form>
                </div>
                <div className='login--rightcontainer'>
                    <img className="login--loginimage" src={LoginImage} alt='Login' />
                </div>
            </div>
        </>
    )
}

export default LoginPage;
