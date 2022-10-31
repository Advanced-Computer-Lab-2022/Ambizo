import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";

function AddCorporateTrainee() {

    const [traineeData, setTraineeData] = useState(
        { name: "", username: "", password: "", passwordAgain: "", email: "", showpassword: false }
    )

    const [message, setMessage] = useState(
        { text: "", type: "" }
    )

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setTraineeData(prevtraineeData => ({
            ...prevtraineeData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    function checkSubmit() {
        //check all fields are filled
        let filled = true
        for (const field in traineeData) {
            if (traineeData[field] === "")
                filled = false
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        //check passwords match
        let passwordNoMatch = !(traineeData.password === traineeData.passwordAgain)
        if (passwordNoMatch) {
            setMessage({ text: "The passwords you entered do not match.", type: "form--errormessage" })
            setTraineeData(prevData => {
                return { ...prevData, passwordAgain: "" }
            })
            return false;
        }
        //chech all password requirements
        let passwordlength = traineeData.password.length
        let checkRequirements = () => {
            let requirments = [false, false, false, false];   //[cabital, small, number, symbol]
            let count = 0;
            for (var i = 0; i < traineeData.password.length; i++) {
                let character = traineeData.password[i];
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
        if (checkSubmit()) {
            return AdministratorService.addTrainee(traineeData)
                .then((result) => {
                    setMessage({ text: `A new Trainee with user name "${result.data.Username}" is added correctly`, type: "form--successmessage" })
                    setTraineeData({ name: "", username: "", password: "", passwordAgain: "", email: "", showpassword:false })
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    return (
        <>
            <Header />
            <div className="form--div">
                <h1>Add new Corporate Trainee</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        onChange={handleChange}
                        name="name"
                        value={traineeData.name}
                    />
                    <input
                        type="text"
                        placeholder="Enter User Name"
                        onChange={handleChange}
                        name="username"
                        value={traineeData.username}
                    />
                    <input
                        type="text"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        name="email"
                        value={traineeData.email}
                    />
                    <input
                        type={traineeData.showpassword ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={handleChange}
                        name="password"
                        value={traineeData.password}
                    />
                    <input
                        type={traineeData.showpassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        name="passwordAgain"
                        value={traineeData.passwordAgain}
                    />
                    <input
                        type="checkbox"
                        id="showpassword"
                        checked={traineeData.showpassword}
                        onChange={handleChange}
                        name="showpassword"
                    />
                    <label htmlFor="showpassword">Show Password</label>
                    <button className="form--button">Submit</button>
                    <p className={message.type}>{message.text}</p>
                </ form>
            </div>
        </>
    )
}

export default AddCorporateTrainee;