import React from "react";
import XIcon from '../../images/XIcon.png'
import CountrySelector from "./CountrySelector";
import WorldMapIcon from '../../images/WorldMapIcon.png'

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
                    <img src={WorldMapIcon} alt='World Map Icon' className='worldmap--icon'/>
                </div>
                </div>
            )
            }
        </>
    );
}

export default CountryModal;