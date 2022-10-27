import React from 'react';
import canChamLogo from '../../images/CanChamLogo.png'
import SearchBar from '../SearchBar/SearchBar';
import CountryIcon from '../../images/CountryIcon.png'

function Header(props) {
    return (
        <nav>
            <img src={canChamLogo} alt='CanCham Logo' className='nav--logo'/>
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
            <button class="country--button" onClick={props.toggleCountryModal}/>
        </nav>
    )
}

export default Header;