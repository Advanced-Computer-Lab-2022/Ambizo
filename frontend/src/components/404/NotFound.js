import React, {useEffect} from "react";
import Header from "../Header/Header";

function NotFound() {

    useEffect(() => {
        document.title = "Error 404";
    }, []);

    return (
        <>
            <Header />
            <div>
                <h1> Error 404. </h1>
            </div>
        </>
    )
}

export default NotFound;