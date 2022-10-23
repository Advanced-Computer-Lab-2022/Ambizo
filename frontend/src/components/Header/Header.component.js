import React from 'react';
import { Link } from "react-router-dom";
import logo from "../../images/logo.svg";

function Header() {
    return (
        <header>
            <nav className="nav">
                <img src={logo} alt="Logo" className="nav-logo" />
                <ul className="nav-items">
                <Link to="/">
                        <li>
                            <button
                                className="homepage-btn">  Home &nbsp; <i className="fa-solid fa-house"></i>
                            </button>
                        </li>
                    </Link>
                    <Link to="/contact">
                        <li>
                            <button
                                className="contact-btn">  Contact &nbsp; <i className="fa-solid fa-phone"></i>
                            </button>
                        </li>
                    </Link>
                </ul>
            </nav>
        </header>
    )
}

export default Header;