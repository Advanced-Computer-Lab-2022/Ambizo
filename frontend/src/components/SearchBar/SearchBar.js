import React from "react";
import searchIcon from '../../images/SearchIcon.png'

function SearchBar() {
    function handleChange(event) {
        
    }

    return (
        <>
            <input
                className="search--input"
                id="search" 
                type="text"
                placeholder="Search for courses (course title, subject or instructor) ..." 
                name="search"
                onChange={handleChange}
                // value={}
            />
            <img src={searchIcon} alt='Search Icon' className='search--icon'/>
            <button className="search--button" />
        </>
    )
}

export default SearchBar;