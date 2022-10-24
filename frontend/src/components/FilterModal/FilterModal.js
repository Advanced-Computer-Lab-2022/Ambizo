import React from "react";
import XIcon from '../../images/XIcon.png'
import Multiselect from "multiselect-react-dropdown";

function FilterModal(props) {

    if(props.filterModal) {
        document.body.classList.add('active-modal')
    } 
    else {
        document.body.classList.remove('active-modal')
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
                        placeholder="Subject"
                        displayValue="key"
                        onKeyPressFn={function noRefCheck(){}}
                        onRemove={function noRefCheck(){}}
                        onSearch={function noRefCheck(){}}
                        onSelect={function noRefCheck(){}}
                        options={[
                            {
                            cat: 'Group 1',
                            key: 'Software Development'
                            },
                            {
                            cat: 'Group 1',
                            key: 'Business'
                            },
                            {
                            cat: 'Group 1',
                            key: 'Personal Development'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Design'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Mathematics'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Marketing'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Photography'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Health and Fitness'
                            },
                            {
                            cat: 'Group 2',
                            key: 'Music'
                            }
                        ]}
                        showCheckbox
                    />
                    <Multiselect
                        placeholder="Rating"
                        displayValue="key"
                        singleSelect={true}
                        onKeyPressFn={function noRefCheck(){}}
                        onRemove={function noRefCheck(){}}
                        onSearch={function noRefCheck(){}}
                        onSelect={function noRefCheck(){}}
                        options={[
                            {
                            cat: 'Group 1',
                            key: '⭐ & up'
                            },
                            {
                            cat: 'Group 1',
                            key: '⭐⭐ & up'
                            },
                            {
                            cat: 'Group 1',
                            key: '⭐⭐⭐ & up'
                            },
                            {
                            cat: 'Group 2',
                            key: '⭐⭐⭐⭐ & up'
                            },
                            {
                            cat: 'Group 2',
                            key: '⭐⭐⭐⭐⭐'
                            }
                        ]}
                        showCheckbox
                    />
                    <p className="price--range">Price Range:</p>
                    <div className="input-minmax">
                        <input className="input--minprice" type="number" placeholder="Minimum Price" />
                        <input className="input--maxprice" type="number" placeholder="Maximum Price" />
                    </div>


                    <img src={XIcon} alt='X Icon' className='x--icon'/>
                    <button className="close-modal" onClick={props.toggleFilterModal}></button>

                    <button class="filterapply--button">Apply</button>
                </div>
                </div>
            )
            }
        </>
    )
}

export default FilterModal;