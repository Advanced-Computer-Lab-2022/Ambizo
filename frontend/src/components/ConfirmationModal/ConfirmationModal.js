import React from "react";

function ConfirmationModal(props) {

    if(props.confirmModal) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
    }

    function handleCancel() {
        props.toggleConfirmationModal();
    }

    return (
        <>
        {props.confirmModal && 
            (
                <div className="modal">
                    <div onClick={props.toggleConfirmationModal} className="overlay"></div>
                    <div className="modal-content-confirmation">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <p className="confirmation--message">{props.confirmationMessage}</p>
                        {props.actionCannotBeUndone && <p className="action--cannotbeundone">This action cannot be undone.</p>}
                        <div className="confirmation--buttons">
                            <button className='button--yessure' onClick={props.handleConfirm} >Yes, I'm sure</button>
                            <button className='button--cancel' onClick={handleCancel} >Cancel</button>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default ConfirmationModal;