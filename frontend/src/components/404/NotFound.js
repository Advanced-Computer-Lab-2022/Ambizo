import React, {useEffect} from "react";

function NotFound() {

    useEffect(() => {
        document.title = "Error 404";
    }, []);

    return (
        <div>
            <h1> Error 404. </h1>
        </div>
    )
}

export default NotFound;