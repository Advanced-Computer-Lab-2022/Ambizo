import React, {useEffect} from "react";
import Header from "../Header/Header";

function NotFound() {

    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        document.title = "Error 404";
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <>
            <div className={"loader-container" + (!isLoading? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {isLoading?
            (
                <>
                    <Header />
                </>
            )
            :
            (
                <>
                    <Header />
                    <div>
                        <h1> Error 404. </h1>
                    </div>
                </>
            )
            }
        </>
    )
}

export default NotFound;