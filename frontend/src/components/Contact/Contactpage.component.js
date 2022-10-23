import React, {useEffect} from "react";

function Contactpage() {

    useEffect(() => {
        document.title = "Contact Page";
    }, []);

    return (
        <div>
            <h1> Contact Us </h1>
        </div>
    )
}

export default Contactpage;