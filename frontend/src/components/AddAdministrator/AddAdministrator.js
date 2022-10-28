import React, { useState } from "react";
import Header from "../Header/Header";
import AdministratorService from "../../services/Administrator.service";

function AddAdministrator() {

    const [adminData, setAdminData] = useState(
        {username: "", password: "", passwordAgain: ""}
    )

    let passwordNoMatch = adminData.passwordAgain!=="" && !(adminData.password === adminData.passwordAgain)
    
    function handleChange(event) {
        const {name,value} = event.target
        setAdminData(prevAdminData => ({
            ...prevAdminData,
            [name]: value
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault();
         return AdministratorService.addAdmin(adminData)
            .then((result) => {
                setAdminData({ username: "", password: "", passwordAgain: "" })
            })
             .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Header />
            <h1>Add new Administrator</h1>
            <form onSubmit={handleSubmit}>
                <input className="newAdmin"
                    type="text"
                    placeholder="Enter User Name"
                    onChange={handleChange}
                    name="username"
                    value={adminData.username}
                />
                <input className="newAdmin"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    name="password"
                    value={adminData.password}
                />
                <input className="newAdmin"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    name="passwordAgain"
                    value={adminData.passwordAgain}
                />
                {passwordNoMatch && <p>The Passwords you entered do not match</p>}
                <button>Submit</button>
            </ form>
        </>
    )
}

export default AddAdministrator;