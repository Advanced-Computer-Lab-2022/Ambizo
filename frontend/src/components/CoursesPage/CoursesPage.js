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

async function retrieveFilteredCourses(setIsLoading ,filterURL){
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

function CoursesPage() {

    const [filterModal, setFilterModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const toggleFilterModal = () => {
        setFilterModal(prevModal => !prevModal);
        resetFilters();
    };

    const [coursesData, setCoursesData] = React.useState([]);

    React.useEffect(() => {
        document.title = "All Courses";
        retrieveAllCourses(setIsLoading)
        .then(coursesList => setCoursesData(coursesList.data))
        .catch(error => {
            console.log(error);
        })
    }, []);

    const coursesDataElements = coursesData.map(course => {
        return (
            <Course
                key={course._id}
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

    function handleFreeCoursesOnly(checked) {
        if(checked) {
            setPriceFilterData({
                    minimumPrice: 0,
                    maximumPrice: 0
                })
        }
        setFreeCoursesOnly(prevFreeCoursesOnly => !prevFreeCoursesOnly)  
    }

    function applyFilters() {
        if(priceFilterData.minimumPrice > priceFilterData.maximumPrice && priceFilterData.maximumPrice !== '') {
            
        }
        else {
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
            if(priceFilterData.minimumPrice !== '') {
                filterURL += parseFloat(priceFilterData.minimumPrice) + ","
            }
            else {
                filterURL += 0 + ","
            }
            if(priceFilterData.maximumPrice !== '') {
                filterURL += parseFloat(priceFilterData.maximumPrice)
            }
            else {
                filterURL += 1000000 + ""
            }
            retrieveFilteredCourses(setIsLoading, filterURL)
            .then(coursesList => setCoursesData(coursesList.data))
            .catch(error => {
                console.log(error);
            })
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

    function renderCourseHeader(toggleFilterModal) {
        return (
            <>
                <div className='coursesTitleFilter'>
                    <div className='coursesTitleFilter--header'>
                        <p>All Courses</p>
                    </div>
                    <img src={FilterIcon} alt='Filter Icon' className='filter--icon'/>
                    <button className="filter--button" onClick={toggleFilterModal}/>
                </div>
                <hr  className='header--line'/>
                <FilterModal filterModal={filterModal} toggleFilterModal={toggleFilterModal} 
                onSelectSubjects={onSelectSubjects} onSelectRating={onSelectRating} priceFilterData={priceFilterData} 
                handlePriceFilterChange={handlePriceFilterChange} applyFilters={applyFilters} resetFilters={resetFilters} 
                freeCoursesOnly={freeCoursesOnly} handleFreeCoursesOnly={handleFreeCoursesOnly} />
            </>
        )
    }
    
    return (
        <>
            {isLoading ? 
            (
                <>
                    {
                    /* Normal Loading Animation
                        <div className="loader-container">
                            <div className="spinner"> </div>
                        </div>
                    */
                    }

                    <Header />
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
                    <Header />
                    {renderCourseHeader(toggleFilterModal)}
                    <section className="courses-list">
                        {coursesDataElements}
                    </section>
                </>
            )
            }
        </>
    )
}

export default CoursesPage