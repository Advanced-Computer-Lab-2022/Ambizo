import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";

function AddCorporateTrainee() {

    const [traineeData, setTraineeData] = useState(
        { name: "", username: "", password: "", passwordAgain: "", email:"" }
    )

    let passwordNoMatch = traineeData.passwordAgain !== "" && !(traineeData.password === traineeData.passwordAgain)

    function handleChange(event) {
        const { name, value } = event.target
        setTraineeData(prevtraineeData => ({
            ...prevtraineeData,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault();
        return AdministratorService.addTrainee(traineeData)
            .then((result) => {
                setTraineeData({ name: "", username: "", password: "", passwordAgain: "", email:"" })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Header />
            <h1>Add new Corporate Trainee</h1>
            <form onSubmit={handleSubmit}>
                <input className="newTrainee"
                    type="text"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    name="name"
                    value={traineeData.name}
                />
                <input className="newTrainee"
                    type="text"
                    placeholder="Enter User Name"
                    onChange={handleChange}
                    name="username"
                    value={traineeData.username}
                />
                <input className="newTrainee"
                    type="text"
                    placeholder="Enter Email"
                    onChange={handleChange}
                    name="email"
                    value={traineeData.email}
                />
                <input className="newTrainee"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    name="password"
                    value={traineeData.password}
                />
                <input className="newTrainee"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    name="passwordAgain"
                    value={traineeData.passwordAgain}
                />
                {passwordNoMatch && <p>The Passwords you entered do not match</p>}
                <button>Submit</button>
            </ form>
        </>
    )
}

export default AddCorporateTrainee;