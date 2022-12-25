import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";
import AddUserImage from '../../images/AddUserImage.svg'

function AddAdministrator() {

    const [adminData, setAdminData] = useState(
        { username: "", password: "", passwordAgain: "", showpassword: false}
    )

    const [message, setMessage] = useState(
        { text: "", type: ""}
    )
    
    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setAdminData(prevAdminData => ({
            ...prevAdminData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    function checkSubmit() {
        //check all fields are filled
        let filled = true
        for (const field in adminData) {
            if (adminData[field] === "")
                filled = false
        }
        if (!filled) {
            setMessage({ text: "All fields are required", type: "form--errormessage" })
            return false;
        }
        //check passwords match
        let passwordNoMatch = !(adminData.password === adminData.passwordAgain)
        if (passwordNoMatch) {
            setMessage({ text: "The passwords you entered do not match.", type: "form--errormessage" })
            setAdminData(prevData => {
                return { ...prevData, passwordAgain: "" }
            })
            return false;
        }
        //chech all password requirements
        let passwordlength = adminData.password.length
        let checkRequirements = () => {
            let requirments = [false, false, false, false];   //[cabital, small, number, symbol]
            let count = 0;
            for (var i = 0; i < adminData.password.length; i++) {
                let character = adminData.password[i];
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
        if(checkSubmit()) {
            return AdministratorService.addAdmin(adminData)
                .then((result) => {
                    setMessage({ text: `A new Administrator with user name "${result.data.Username}" is added correctly`, type: "form--successmessage" })
                    setAdminData({ username: "", password: "", passwordAgain: "", showpassword:false })
                })
                .catch((error) => {
                    setMessage({ text: error.response.data, type: "form--errormessage" })
                })
        }
    }

    return (
        <>
            <Header />
            <div className="form--container">
                <div className="form--leftcontainer">
                    <h1 className="form--header">Add Another Admin</h1>
                    <form className="form--form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            onChange={handleChange}
                            name="username"
                            value={adminData.username}
                            className="form--inputfield"
                        />

                        <input
                            type={adminData.showpassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={handleChange}
                            name="password"
                            value={adminData.password}
                            className="form--inputfield"
                        />
                        <input
                            type={adminData.showpassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            name="passwordAgain"
                            value={adminData.passwordAgain}
                            className="form--inputfield"
                        />
                        <button className="form--submitbutton">Create</button>
                        <div className="show-password-div">
                            <input
                                type="checkbox"
                                id="showpassword"
                                checked={adminData.showpassword}
                                onChange={handleChange}
                                name="showpassword"
                            />
                            <label htmlFor="showpassword">Show Password</label>
                            
                        </div>
                        {message.text !== "" && <p className={message.type}>{message.text}</p>}
                    </ form>
                </div>
                <div className='form--rightcontainer'>
                    <img className="form--loginimage" src={AddUserImage} alt='Add User' />
                </div>
            </div>
        </>
    )
}

export default AddAdministrator;