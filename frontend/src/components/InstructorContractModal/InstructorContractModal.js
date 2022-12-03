import React from "react"

 function InstructorContractModal(props){

    if(props.contractModal) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
    }

    function handleCancel() {
        props.toggleContractModal();
    }

    return (
        <>
        {props.contractModal && 
            (
                <div className="contractPopup">
                    <div onClick={props.toggleContractModal} className="overlay"></div>
                    <div className="modal-content-confirmation">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <p className="confirmation--message"> By clicking "Accept", you hereby accept CCC's terms and conditions 
                        and contracts regarding the rights to the posted videos and materials as well as the % taken by the company</p>
                        <div className="confirmation--buttons">
                            <button className='button--yessure' onClick={props.handleAcceptContract} >Yes, I'm sure</button>
                            <button className='button--cancel' onClick={handleCancel} >Cancel</button>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default InstructorContractModal