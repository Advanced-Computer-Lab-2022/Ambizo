import React from 'react';
import FilterIcon from '../../images/FilterIcon.png'

function CourseHeader(props) {
    return (
        <>
            <div className='coursesTitleFilter'>
                <div className='coursesTitleFilter--header'>
                    <p>All Courses</p>
                </div>
                <img src={FilterIcon} alt='Filter Icon' className='filter--icon'/>
                <button class="filter--button" onClick={props.toggleFilterModal}/>
            </div>
            <hr  className='header--line'/>
        </>
    )
}

export default CourseHeader;