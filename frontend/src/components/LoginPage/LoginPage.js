import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Header from "../Header/Header.js"
import LoginService from "../../services/Login.service";

function LoginPage() {

    const [userData, setUserData] = useState(
        { username: "", password: "", showpassword: false}
    )

    const [message, setMessage] = useState(
        { text: "", type: ""}
    )
    const navigate = useNavigate();
    
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
            setMessage({ text: "All fields are required", type: "errorMessage" })
            return false;
        }

        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(checkSubmit()) {
                LoginService.getUserType(userData)
                .then((result) => {
                    LoginService.login(userData, result.data.Type)
                    .then((user) => {
                        sessionStorage.setItem("Type", result.data.Type);
                        sessionStorage.setItem("ID", user.data._id);
                        navigate("/");
                    })
                    .catch((error) => {
                        setMessage({ text: error.response.data, type: "errorMessage" })
                    })
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "errorMessage" })
                })
        }
    }

    return (
        <>
            <Header />
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input className="userLogin"
                    type="text"
                    placeholder="Enter User Name"
                    onChange={handleChange}
                    name="username"
                    value={userData.username}
                />
                <input className="userLogin"
                    type={userData.showpassword ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={handleChange}
                    name="password"
                    value={userData.password}
                />
                <input
                    type="checkbox"
                    id="showpassword"
                    checked={userData.showpassword}
                    onChange={handleChange}
                    name="showpassword"
                />
                <label htmlFor="showpassword">Show Password</label>
                <button>Login</button>
                <p className={message.type}>{message.text}</p>
            </ form>
        </>
    )
}

export default LoginPage;
