import React from "react";
import searchIcon from '../../images/SearchIcon.png'

function SearchBar(props) {
    const [searchTerm, setSearchTerm] = React.useState("");

    function handleChange(event) {
        setSearchTerm(event.target.value)
    }

    return (
        <>
            <input
                className="search--input"
                id="search" 
                type="text"
                placeholder={props.placeholder || "Search for courses (course title, subject or instructor) ..."} 
                name="search"
                onChange={handleChange}
                value={searchTerm}
            />
            <img src={searchIcon} alt='Search Icon' className='search--icon'/>
            <button onClick={() => {setSearchTerm(""); props.searchForCourses(searchTerm)}} className="search--button" />
        </>
    )
}

export default SearchBar;