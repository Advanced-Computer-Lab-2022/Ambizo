import React from 'react';
import { Link } from "react-router-dom"
import CountryModal from "../CountryModal/CountryModal";
import canChamLogo from '../../images/CanChamLogo.png'
import SearchBar from '../SearchBar/SearchBar';
import CountryIcon from '../../images/CountryIcon.png'

function Header() {

    const [countryModal, setCountryModal] = React.useState(false);

    const toggleCountryModal = () => {
        setCountryModal(prevModal => !prevModal);
    };

    return (
        <>
            <nav>
                <Link to="/">
                    <img src={canChamLogo} alt='CanCham Logo' className='nav--logo'/>
                </Link>
                <SearchBar />
                <button 
                    className='button--login'
                    // onClick={}
                    >Log in
                </button>
                <button 
                    id='delete-product-button'
                    className='button--signup'
                    // disabled={}
                    // onClick={}
                    >Sign up
                </button>
                <img src={CountryIcon} alt='Country Icon' className='country--icon'/>
                <button className="country--button" onClick={toggleCountryModal}/>
            </nav>

            <CountryModal countryModal={countryModal} toggleCountryModal={toggleCountryModal} />
        </>
    )
}

export default Header;