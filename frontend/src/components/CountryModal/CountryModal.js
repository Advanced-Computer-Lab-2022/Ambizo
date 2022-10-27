import React from "react";
import XIcon from '../../images/XIcon.png'
import CountrySelector from "../CountrySelector/CountrySelector";
import ChooseCountryIcon from '../../images/ChooseCountryIcon.png'

function CountryModal(props) {
    if(props.countryModal) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            {props.countryModal && 
            (
                <div className="modal">
                <div onClick={props.toggleCountryModal} className="overlay"></div>
                <div className="modal-content">
                    <CountrySelector />
                    <img src={XIcon} alt='X Icon' className='x--icon'/>
                    <button className="close-modal" onClick={props.toggleCountryModal}></button>
                    <div className="choose--country">
                        <p className="chooseCountry--text">Choose your country.</p>
                        <img src={ChooseCountryIcon} alt='Choose Country Icon' className='chooseCountry--icon'/>
                    </div>
                </div>
                </div>
            )
            }
        </>
    );
}

export default CountryModal;