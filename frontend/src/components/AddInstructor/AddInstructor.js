import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";

function AddInstructor() {

    const [instructorData, setInstructorData] = useState(
        { username: "", password: "", passwordAgain: "", name: "", email: "", showpassword: false }
    )

    const [message, setMessage] = useState(
        { text: "", type: "" }
    )

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setInstructorData(prevInstructorData => ({
            ...prevInstructorData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    function checkSubmit() {
        //check all fields are filled
        let filled = true
        for (const field in instructorData) {
            if (instructorData[field] === "")
                filled = false
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "errorMessage" })
            return false;
        }
        //check passwords match
        let passwordNoMatch = !(instructorData.password === instructorData.passwordAgain)
        if (passwordNoMatch) {
            setMessage({ text: "The passwords you entered do not match.", type: "errorMessage" })
            setInstructorData(prevData => {
                return { ...prevData, passwordAgain: "" }
            })
            return false;
        }
        //chech all password requirements
        let passwordlength = instructorData.password.length
        let checkRequirements = () => {
            let requirments = [false, false, false, false];   //[cabital, small, number, symbol]
            let count = 0;
            for (var i = 0; i < instructorData.password.length; i++) {
                let character = instructorData.password[i];
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
                { text: "Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols.", type: "errorMessage" }
            )
            return false;
        }
        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (checkSubmit()) {
            return AdministratorService.addInstructor(instructorData)
                .then((result) => {
                    setMessage({ text: `A new Instructor with user name "${result.data.Username}" is added correctly`, type: "confirmMessage" })
                    setInstructorData({ username: "", password: "", passwordAgain: "", name: "", email: "", showpassword:"" })
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "errorMessage" })
                })
        }
    }

    return (
        <>
            <Header />
            <div className="form--div">
                <h1>Add new Instructor</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        onChange={handleChange}
                        name="name"
                        value={instructorData.name}
                    />
                    <input
                        type="text"
                        placeholder="Enter User Name"
                        onChange={handleChange}
                        name="username"
                        value={instructorData.username}
                    />
                    <input
                        type="text"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        name="email"
                        value={instructorData.email}
                    />
                    <input
                        type={instructorData.showpassword ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={handleChange}
                        name="password"
                        value={instructorData.password}
                    />
                    <input
                        type={instructorData.showpassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        name="passwordAgain"
                        value={instructorData.passwordAgain}
                    />
                    <input
                        type="checkbox"
                        id="showpassword"
                        checked={instructorData.showpassword}
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

export default AddInstructor;