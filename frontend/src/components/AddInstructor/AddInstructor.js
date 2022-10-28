import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";

function AddInstructor() {

    const [instructorData, setInstructorData] = useState(
        { username: "", password: "", passwordAgain: "", name: "" }
    )

    let passwordNoMatch = instructorData.passwordAgain !== "" && !(instructorData.password === instructorData.passwordAgain)

    function handleChange(event) {
        const { name, value } = event.target
        setInstructorData(prevInstructorData => ({
            ...prevInstructorData,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault();
        return AdministratorService.addInstructor(instructorData)
            .then((result) => {
                setInstructorData({ username: "", password: "", passwordAgain: "", name: "" })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Header />
            <h1>Add new Instructor</h1>
            <form onSubmit={handleSubmit}>
                <input className="newInstructor"
                    type="text"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    name="name"
                    value={instructorData.name}
                />
                <input className="newInstructor"
                    type="text"
                    placeholder="Enter User Name"
                    onChange={handleChange}
                    name="username"
                    value={instructorData.username}
                />
                <input className="newInstructor"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    name="password"
                    value={instructorData.password}
                />
                <input className="newInstructor"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    name="passwordAgain"
                    value={instructorData.passwordAgain}
                />
                {passwordNoMatch && <p>The Passwords you entered do not match</p>}
                <button>Submit</button>
            </ form>
        </>
    )
}

export default AddInstructor;