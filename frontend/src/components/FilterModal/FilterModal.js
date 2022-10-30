import React from "react";
import XIcon from '../../images/XIcon.png'
import Multiselect from "multiselect-react-dropdown";
import Alert from '@mui/material/Alert';

function FilterModal(props) {

    if(props.filterModal) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
    }

    function onSelectSubjects(selectedList) {
        props.onSelectSubjects(selectedList);
    }

    function onSelectRating(selectedItem) {
        props.onSelectRating(selectedItem);
    }

    function handlePriceChange(event) {
        const {name, value} = event.target
        props.handlePriceFilterChange(name, value)
    }

    function handleFreeCoursesOnly() {
        props.handleFreeCoursesOnly()
    }

    function applyFilters() {
        props.applyFilters();
    }

    return (
        <>
            {props.filterModal && 
            (
                <div className="modal">
                <div onClick={props.toggleFilterModal} className="overlay"></div>
                <div className="modal-content-filter">
                    <h2>Filter Courses By:</h2>
                    <Multiselect
                        id='subjects'
                        name='subjects'
                        avoidHighlightFirstOption={true}
                        placeholder="Subject"
                        displayValue="key"
                        onKeyPressFn={function noRefCheck(){}}
                        onRemove={onSelectSubjects}
                        onSearch={function noRefCheck(){}}
                        onSelect={onSelectSubjects}
                        options={[
                            {
                                id: 'subject1',
                                key: 'Software Development'
                            },
                            {
                                id: 'subject2',
                                key: 'Business'
                            },
                            {
                                id: 'subject3',
                                key: 'Personal Development'
                            },
                            {
                                id: 'subject4',
                                key: 'Design'
                            },
                            {
                                id: 'subject5',
                                key: 'Mathematics'
                            },
                            {
                                id: 'subject6',
                                key: 'Marketing'
                            },
                            {
                                id: 'subject7',
                                key: 'Photography'
                            },
                            {
                                id: 'subject8',
                                key: 'Health and Fitness'
                            },
                            {
                                id: 'subject9',
                                key: 'Music'
                            }
                        ]}
                        showCheckbox
                    />
                    <Multiselect
                        placeholder="Rating"
                        displayValue="key"
                        singleSelect={true}
                        avoidHighlightFirstOption={true}
                        onKeyPressFn={function noRefCheck(){}}
                        onRemove={onSelectRating}
                        onSearch={function noRefCheck(){}}
                        onSelect={onSelectRating}
                        options={[
                            {
                                id: 1,
                                key: '⭐ & up'
                            },
                            {
                                id: 2,
                                key: '⭐⭐ & up'
                            },
                            {
                                id: 3,
                                key: '⭐⭐⭐ & up'
                            },
                            {
                                id: 4,
                                key: '⭐⭐⭐⭐ & up'
                            },
                            {
                                id: 5,
                                key: '⭐⭐⭐⭐⭐'
                            }
                        ]}
                        showCheckbox
                    />
                    <p className="price--range">Price Range:</p>
                    <div className="input-minmax">
                        <input 
                            id="minimumPrice"
                            name="minimumPrice"
                            min="0"
                            disabled={props.freeCoursesOnly}
                            onChange={handlePriceChange}
                            value={props.minimumPrice}
                            className="input--minprice" 
                            type="number"  
                            placeholder="Minimum Price" 
                        />
                        <input 
                            id="maximumPrice"
                            name="maximumPrice"
                            disabled={props.freeCoursesOnly}
                            onChange={handlePriceChange}
                            value={props.maximumPrice}
                            className="input--maxprice" 
                            type="number" 
                            placeholder="Maximum Price" 
                        />
                    </div>


                    <img src={XIcon} alt='X Icon' className='x--icon'/>
                    <button className="close-modal" onClick={props.toggleFilterModal}></button>
                    {props.filterPriceErrorMessage && <Alert className="alert--pricerange" variant="filled" severity="error">Minimum Price must be less than Maximum Price.</Alert>}
                    <input 
                        type="checkbox" 
                        id="freeCoursesOnly" 
                        className="free--checkbox"
                        checked={props.freeCoursesOnly}
                        onChange={handleFreeCoursesOnly}
                        name="freeCoursesOnly"
                    />
                    <label htmlFor="freeCoursesOnly">Free Courses Only</label>
                    
                    <button className="filterapply--button" onClick={applyFilters}>Apply</button>
                    
                </div>
                </div>
            )
            }
        </>
    )
}

export default FilterModal;