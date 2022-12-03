import React, {useState} from 'react';

function ScrollToTopButton() {

    const [visible, setVisible] = useState(false)

    function toggleVisible() {
        if (window.scrollY > 300){
            setVisible(true)
        }
        else if (window.scrollY <= 300){
            setVisible(false)
        }
    }

    function scrollToTop(){
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('scroll', toggleVisible);

    return (
        
        <div
            onClick={scrollToTop}
            className="scrollToTopButton"
            style={{display: visible ? 'inline' : 'none'}} 
            >
            <i class="fa-solid fa-circle-arrow-up"></i> 
        </div>
    );
}

export default ScrollToTopButton;
