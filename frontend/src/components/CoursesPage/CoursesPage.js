import React from "react";
import Header from "../Header/Header";
import FilterModal from "../FilterModal/FilterModal";
import Course from "../Course/Course";
import CourseService from "../../services/Course.service";
import FilterIcon from "../../images/FilterIcon.png";


async function retrieveAllCourses(setIsLoading){
    setIsLoading(true);
    return CourseService.getAllCourses()
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveFilteredCourses(setIsLoading, filterURL){
    setIsLoading(true);
    return CourseService.getFilteredCourses(filterURL)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveNotDiscountedCourses(setIsLoading) {
    setIsLoading(true);
    return CourseService.getNotDiscountedCourses()
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveNotDiscountedFilteredCourses(setIsLoading, filterURL){
    setIsLoading(true);
    return CourseService.getNotDiscountedFilteredCourses(filterURL)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveDiscountedCourses(setIsLoading) {
    setIsLoading(true);
    return CourseService.getDiscountedCourses()
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveDiscountedFilteredCourses(setIsLoading, filterURL){
    setIsLoading(true);
    return CourseService.getDiscountedFilteredCourses(filterURL)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrievePopularCourses(setIsLoading){
    setIsLoading(true);
    return CourseService.getPopularCourses()
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

function CoursesPage(props) {

    const [filterModal, setFilterModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const toggleFilterModal = () => {
        setFilterModal(prevModal => !prevModal);
        setFilterPriceErrorMessage(false)
        resetFilters();
    };

    const [coursesData, setCoursesData] = React.useState([]);

    React.useEffect(() => {
        if(props.adminNotDiscountedCourses) {
            retrieveNotDiscountedCourses(setIsLoading)
            .then((coursesList) => {
                setCoursesData(coursesList.data)
            })
            .catch(error => {
                console.log(error);
            })
        }
        else if(props.adminDiscountedCourses) {
            retrieveDiscountedCourses(setIsLoading)
            .then((coursesList) => {
                setCoursesData(coursesList.data)
            })
            .catch(error => {
                console.log(error);
            })
        }
        else {
            if(props.mostPopular){
                retrievePopularCourses(setIsLoading)
                .then((coursesList) => {
                    setCoursesData(coursesList.data)
                })
            }
            else{
                retrieveAllCourses(setIsLoading)
                .then((coursesList) => {
                    setCoursesData(coursesList.data)
                })
                .catch(error => {
                    console.log(error);
                })
            }
        }
    }, [props.isSubmitted]);

    const coursesDataElements = coursesData.map((course) => {
        if(props.coursesToBeDiscounted?.includes(course._id)) {
            course = {...course, isChecked: true}
        }
        if(props.coursesToRemoveDiscount?.includes(course._id)) {
            course = {...course, isChecked: true}
        }
        return (
            <Course
                key={course._id}
                adminSetPromo ={props.setPromoTitle}
                handleAdminSelectionChange={handleAdminSelectionChange}
                isChecked={false}
                {...course}
            />
        )
    })

    const [subjectFilterData, setSubjectFilterData] = React.useState([])

    function onSelectSubjects(selectedList) {
        setSubjectFilterData(selectedList);
    }

    const [ratingFilterData, setRatingFilterData] = React.useState([])

    function onSelectRating(selectedItem) {
        setRatingFilterData(selectedItem);
    }

    const [priceFilterData, setPriceFilterData] = React.useState(
        {
            minimumPrice: '',
            maximumPrice: ''
        }
    )

    function handlePriceFilterChange(name, value) {
        setPriceFilterData(prevPriceFilterData => {
            return {
                ...prevPriceFilterData,
                [name]: parseFloat(value)
            }
        })
    }

    const [freeCoursesOnly, setFreeCoursesOnly] = React.useState(false);

    function handleFreeCoursesOnly() {
        setFreeCoursesOnly(prevFreeCoursesOnly => !prevFreeCoursesOnly)  
    }

    const [filterPriceErrorMessage, setFilterPriceErrorMessage] = React.useState(false);

    function applyFilters() {
        if(priceFilterData.minimumPrice > priceFilterData.maximumPrice && priceFilterData.maximumPrice !== '' && !freeCoursesOnly) {
            setFilterPriceErrorMessage(true);
        }
        else {
            setFilterPriceErrorMessage(false);
            let filterURL = "?subject=";
            for (let i = 0; i < subjectFilterData.length; i++) {
                if(i === subjectFilterData.length - 1) {
                    filterURL += subjectFilterData[i].key
                }
                else {
                    filterURL += subjectFilterData[i].key + ","
                }
                    
            }

            filterURL += "&rating="
            if (ratingFilterData.length !== 0) {
                filterURL += ratingFilterData[0].id
            }

            filterURL += "&price="
            if(!freeCoursesOnly){
                if(priceFilterData.minimumPrice !== '') {
                    filterURL += parseFloat(priceFilterData.minimumPrice) + ","
                }
                else {
                    filterURL += 0 + ","
                }

                if(priceFilterData.maximumPrice !== '') {
                    filterURL += parseFloat(priceFilterData.maximumPrice)
                }
            } 
            else{
                filterURL +=  0 + "," + -1
            }

            if(props.adminNotDiscountedCourses) {
                retrieveNotDiscountedFilteredCourses(setIsLoading, filterURL)
                .then((coursesList) => {
                    setCoursesData(coursesList.data)
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else if(props.adminDiscountedCourses) {
                retrieveDiscountedFilteredCourses(setIsLoading, filterURL)
                .then((coursesList) => {
                    setCoursesData(coursesList.data)
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else {
                retrieveFilteredCourses(setIsLoading, filterURL)
                .then((coursesList) => {
                    setCoursesData(coursesList.data)
                })
                .catch(error => {
                    console.log(error);
                })
            }
            toggleFilterModal(); 
            setFreeCoursesOnly(false);
        }
    }

    function resetFilters() {
        setSubjectFilterData([]);
        setRatingFilterData([]);
        setPriceFilterData(
            {
                minimumPrice: "",
                maximumPrice: ""
            }
        )
    }

    function handleAdminSelectionChange(event) {
        const { name, checked } = event.target
        if (name === "adminselectallcourses") {
            let tempCourses = coursesData.map((course) => {
                return {...course, isChecked: checked}
            })
            setCoursesData(tempCourses)
            if(props.adminNotDiscountedCourses) {
                coursesData.forEach((course) => {
                    props.handleCoursesToBeDiscountedSelected(checked, course._id)
                });
            }
            if(props.adminDiscountedCourses) {
                coursesData.forEach((course) => {
                    props.handleCoursesToRemoveDiscountSelected(checked, course._id)
                });
            }
          } 
          else 
          {
            let tempCourses = coursesData.map((course) => 
            course._id === name ? {...course, isChecked: checked} : course)
            setCoursesData(tempCourses)
            if(props.adminNotDiscountedCourses) {
                coursesData.forEach((course) => {
                    if (course._id === name) {
                        props.handleCoursesToBeDiscountedSelected(checked, course._id)
                    }
                });
            }
            if(props.adminDiscountedCourses) {
                coursesData.forEach((course) => {
                    if (course._id === name) {
                        props.handleCoursesToRemoveDiscountSelected(checked, course._id)
                    }
                });
            }
          }   
    }

    function renderCourseHeader(toggleFilterModal) {
        let coursesTitle = "All Courses"
        if(props.mostPopular){
            coursesTitle = "Popular Courses"
        }
        return (
            <>
                <div className='coursesTitleFilter'>
                    <div className='coursesTitleFilter--header'>
                        {!props.setPromoTitle && <p>{coursesTitle}</p>}
                        {props.setPromoTitle && <p>{props.setPromoTitle}</p>}
                    </div>
                    <img src={FilterIcon} alt='Filter Icon' className='filter--icon'/>
                    <button className="filter--button" onClick={toggleFilterModal}/>
                </div>
                <hr  className='header--line'/>
                <FilterModal filterModal={filterModal} toggleFilterModal={toggleFilterModal} 
                onSelectSubjects={onSelectSubjects} onSelectRating={onSelectRating} priceFilterData={priceFilterData} 
                handlePriceFilterChange={handlePriceFilterChange} applyFilters={applyFilters} resetFilters={resetFilters} 
                freeCoursesOnly={freeCoursesOnly} handleFreeCoursesOnly={handleFreeCoursesOnly} 
                filterPriceErrorMessage={filterPriceErrorMessage} setFilterPriceErrorMessage={setFilterPriceErrorMessage} />
            </>
        )
    }
    
    return (
        <>
            {isLoading ? 
            (
                <>
                    {!props.sectionNotPage && <Header />}
                    {renderCourseHeader(toggleFilterModal)}
                    <section className="courses-list">
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                        <Course isLoading={true} />
                    </section>
                </>
            ) 
            : 
            (   
                <>
                    {!props.sectionNotPage && <Header />}
                    {renderCourseHeader(toggleFilterModal)}
                    {props.setPromoTitle && 
                    <div className="adminselectall--checkbox">
                        <input 
                            type='checkbox' 
                            className='admin--selectallcourses' 
                            name='adminselectallcourses' 
                            id='adminselectallcourses' 
                            onChange={handleAdminSelectionChange} 
                            checked={!coursesDataElements.some((course) => course.props.isChecked !== true)} 
                        />
                        <p className="admin--selectalltext">Select All</p>
                    </div>
                    }
                    <section className="courses-list">
                        {coursesDataElements}
                        {coursesDataElements.length === 0 && <p className="no--courses">0 Courses found.</p>}
                    </section>
                </>
            )
            }
        </>
    )
}

export default CoursesPage