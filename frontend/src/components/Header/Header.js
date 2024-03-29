import React from 'react';
import { Link, useNavigate } from "react-router-dom"
import CountryModal from "../CountryModal/CountryModal";
import UserMenu from "../UserMenu/UserMenu"
import canChamLogo from '../../images/CanChamLogo.png'
import SearchBar from '../SearchBar/SearchBar';
import CountryIcon from '../../images/CountryIcon.png'
import ArrowDownIcon from '../../images/ArrowDownIcon.png'
import ArrowUpIcon from '../../images/ArrowUpIcon.png'
import TraineeService from "../../services/Trainee.service.js";
import InstructorService from '../../services/Instructor.service';
import countryToCurrency from 'country-to-currency';
import Wallet from '../Wallet/Wallet.js';


function Header() {

    const [countryModal, setCountryModal] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userMenu, setUserMenu] = React.useState(false);
    const [walletContent, setWalletContent] = React.useState(0);

    const navigate = useNavigate();
    let loggedInUser = JSON.parse(sessionStorage.getItem("User"));

    const toggleCountryModal = () => {
        setCountryModal(prevModal => !prevModal);
    };

    const toggleLogIn = () => {
        navigate("/login");
    }

    const toggleSignUp = () => {
        navigate("/signUp");
    }

    const toggleLogOut = () => {
        sessionStorage.removeItem('Type');
        sessionStorage.removeItem('User');
        sessionStorage.removeItem('Token');
        setIsLoggedIn(false);
        setUserMenu(false)
        if (window.location.pathname === "/") {
            navigate(0)
        }
        else {
            navigate("/");
        }
    }

    const toggleUserMenu = () => {
        setUserMenu(prevMenu => !prevMenu);
    }

    function searchForCourses(searchTerm) {
        if (searchTerm.trim() !== "") {
            navigate("/search/" + searchTerm);
        }
    }

    React.useEffect(() => {
        if (sessionStorage.getItem("Type")) {
            setIsLoggedIn(true)
            if (sessionStorage.getItem('Type') === 'instructor') {
                const currencyCode = countryToCurrency[localStorage.getItem("countryCode")] || "USD";
                InstructorService.getMoneyOwed(currencyCode).then(
                    response => {
                        if (response.status === 200) {
                            setWalletContent(response.data.moneyOwed);
                        } else {
                            console.log(response.status);
                            console.log(response.data);
                        }
                    }
                ).catch(error => {
                    console.log(error);
                });
            } else if (sessionStorage.getItem('Type') === 'individualTrainee') {
                const currencyCode = countryToCurrency[localStorage.getItem("countryCode")] || "USD";
                TraineeService.getWalletAmount(currencyCode).then(
                    response => {
                        if (response.status === 200) {
                            setWalletContent(response.data.wallet);
                        } else {
                            console.log(response.status);
                            console.log(response.data);
                        }
                    }
                ).catch(error => {
                    console.log(error);
                });
            }
        }

    }, []);

    return (
        <header>
            <nav>
                <Link to="/">
                    <img src={canChamLogo} alt='CanCham Logo' className='nav--logo' />
                </Link>
                <SearchBar searchForCourses={searchForCourses} />
                {isLoggedIn ?
                    (
                        <>
                            <div className='user--div'>
                                <div className='nav-controls' onClick={toggleUserMenu}>
                                    <p className='user--button'>{loggedInUser.Username}</p>
                                    {!userMenu && <img src={ArrowDownIcon} alt='Arrow Down Icon' className='arrow--icon' />}
                                    {userMenu && <img src={ArrowUpIcon} alt='Arrow Up Icon' className='arrow--icon' />}
                                    {userMenu && <UserMenu toggleLogOut={toggleLogOut} loggedInUser={loggedInUser} userType={sessionStorage.getItem("Type")} />}
                                </div>
                                {(sessionStorage.getItem('Type') === 'instructor' || sessionStorage.getItem('Type') === 'individualTrainee') ? (
                                    <Wallet 
                                        currencyCode={countryToCurrency[localStorage.getItem("countryCode")] || "USD"}
                                        money={walletContent}
                                    />
                                ) : (
                                    <></>
                                )
                                }
                            </div>
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
                                onClick={toggleSignUp}
                            >Sign up
                            </button>
                        </>
                    )
                }

                <img src={CountryIcon} alt='Country Icon' className='country--icon' />
                <button className="country--button" onClick={toggleCountryModal} />
            </nav>

            <CountryModal countryModal={countryModal} toggleCountryModal={toggleCountryModal} />

        </header>
    )
}

export default Header;