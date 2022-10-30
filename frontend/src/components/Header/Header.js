import React from 'react';
import { Link, useNavigate } from "react-router-dom"
import CountryModal from "../CountryModal/CountryModal";
import canChamLogo from '../../images/CanChamLogo.png'
import SearchBar from '../SearchBar/SearchBar';
import CountryIcon from '../../images/CountryIcon.png'

function Header() {

    const [countryModal, setCountryModal] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const navigate = useNavigate();

    const toggleCountryModal = () => {
        setCountryModal(prevModal => !prevModal);
    };
    
    const toggleLogIn = () => {
        navigate("/login");
        // sessionStorage.setItem('loggedIn', true);
        // setIsLoggedIn(true);
    }

    const toggleLogOut = () => {
        sessionStorage.removeItem('Type');
        sessionStorage.removeItem('User');
        setIsLoggedIn(false);
        navigate("/");
    }

    React.useEffect(() => {
        if(sessionStorage.getItem("Type")){
            setIsLoggedIn(true)
        }
    }, []);

    return (
        <>
            <nav>
                <Link to="/">
                    <img src={canChamLogo} alt='CanCham Logo' className='nav--logo'/>
                </Link>
                <SearchBar />
                {isLoggedIn ?
                (
                    <>
                        <p className='user--button'>Hello, Omar</p>
                        <button 
                            className='button--signup'
                            onClick={toggleLogOut}
                        >Log Out
                        </button>
                    </>
                )
                :
                (
                    <>
                        <button 
                            className='button--login'
                            onClick={toggleLogIn}
                        >Log in
                        </button>
                        <button 
                            id='delete-product-button'
                            className='button--signup'
                            // disabled={}
                            // onClick={}
                        >Sign up
                        </button>
                    </>
                )
                }

                <img src={CountryIcon} alt='Country Icon' className='country--icon'/>
                <button className="country--button" onClick={toggleCountryModal}/>
            </nav>

            <CountryModal countryModal={countryModal} toggleCountryModal={toggleCountryModal} />
        </>
    )
}

export default Header;