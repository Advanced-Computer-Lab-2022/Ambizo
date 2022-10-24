import React from 'react';
import FilterIcon from '../../images/FilterIcon.png'

function CourseHeader(props) {
    return (
        <div className='coursesTitleFilter'>
            <div className='coursesTitleFilter--header'>
                <h1>Courses</h1>
            </div>
            <img src={FilterIcon} alt='Filter Icon' className='filter--icon'/>
            <button class="filter--button" onClick={props.toggleFilterModal}/>
        </div>
    )
}

export default CourseHeader;