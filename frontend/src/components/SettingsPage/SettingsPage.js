import React from "react";
import Header from "../Header/Header";

function SettingsPage() {
    return (
        <>
            <Header />
            <div className="settingspage">
                <div className="settingspage--leftcontainer">
                    <h1 className="settingspage--header"><i className="fa-solid fa-gear"></i>&nbsp;&nbsp;Settings</h1>  
                    <p className="settingspage--signinsecurity"><i className="fa-solid fa-lock"></i>&nbsp;&nbsp;Sign in & security</p>
                </div>
                <div className="settingspage--rightcontainer">

                </div>
            </div>
        </>
    )
}

export default SettingsPage;