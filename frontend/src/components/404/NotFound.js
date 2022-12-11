import React, {useEffect} from "react";
import Header from "../Header/Header";
import errorImage from "../../images/404.svg"
import Error404Image from "../../images/Error404Image.jpg"

function NotFound() {

    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        document.title = "Error 404";
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
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
                        <img src={Error404Image} alt="404 - Not Found" className='error404Image' />
                        <h1 className='error404Text'>The Page You Are Looking For Doesn't Exist.</h1>
                        <h3 className='error404Text'>Or you may not have access, if you have any questions, please contact us at: <a className="support--email" href = "mailto: support@ambizo.com">support@ambizo.com</a></h3>
                    </div>
                </>
            )
            }
        </>
    )
}

export default NotFound;