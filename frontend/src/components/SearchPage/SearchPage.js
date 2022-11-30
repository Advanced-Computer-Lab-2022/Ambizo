import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import FilterModal from "../FilterModal/FilterModal";
import Course from "../Course/Course";
import SearchBar from '../SearchBar/SearchBar';
import CourseService from "../../services/Course.service";
import InstructorService from "../../services/Instructor.service";
import FilterIcon from "../../images/FilterIcon.png";

async function searchCourses(searchTerm, setIsLoading){
    setIsLoading(true);
    return CourseService.searchCourses(searchTerm)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        console.log(error)
        return null;
    })
}

async function searchMyCourses(searchTerm, setIsLoading){
    setIsLoading(true);
    return InstructorService.searchCourses(searchTerm)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        console.log(error)
        return null;
    })
}

async function retrieveMyFilteredCourses(searchTerm, setIsLoading ,filterURL){
    setIsLoading(true);
    return InstructorService.getFilteredCourses(filterURL + "&searchTerm=" + searchTerm)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

async function retrieveFilteredCourses(searchTerm, setIsLoading ,filterURL){
    setIsLoading(true);
    return CourseService.getFilteredCourses(filterURL + "&searchTerm=" + searchTerm)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        setIsLoading(false);
        return null;
    })
}

function SearchPage() {

    const [filterModal, setFilterModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const toggleFilterModal = () => {
        setFilterModal(prevModal => !prevModal);
        setFilterPriceErrorMessage(false)
        resetFilters();
    };

    const [coursesData, setCoursesData] = React.useState([]);

    const params = useParams();

    React.useEffect(() => {
        document.title = "Search Result";
        if(params.mycourses){
            searchMyCourses(params.searchTerm ,setIsLoading)
            .then(coursesList => setCoursesData(coursesList.data))
            .catch(error => {
                console.log(error);
            })
        }
        else{
            searchCourses(params.searchTerm ,setIsLoading)
            .then(coursesList => setCoursesData(coursesList.data))
            .catch(error => {
                console.log(error);
            })
        }
    }, [params.searchTerm, params.mycourses]);

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

            if(params.mycourses){
                retrieveMyFilteredCourses(params.searchTerm, setIsLoading, filterURL)
                .then(coursesList => setCoursesData(coursesList.data))
                .catch(error => {
                    console.log(error);
                })
            }
            else{
                retrieveFilteredCourses(params.searchTerm, setIsLoading, filterURL)
                .then(coursesList => setCoursesData(coursesList.data))
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

    function searchForCourses(searchTerm){
        if(searchTerm.trim() !== ""){
            navigate("/mycourses/search/" + searchTerm);
        } 
    }

    function renderCourseHeader(toggleFilterModal) {
        return (
            <>
                <div className='coursesTitleFilter'>
                    <div className='coursesTitleFilter--header'>
                        <p>{params.mycourses && "My Courses | "} Search Results For: {params.searchTerm} </p>
                    </div>
                    {
                        params.mycourses &&  
                        <div className="searchMyCourses">
                            <SearchBar placeholder={"Search My Courses"} searchForCourses={searchForCourses}/>
                        </div>
                    }
 
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
                        {coursesDataElements.length === 0 && <p className="no--courses">0 Courses found.</p>}
                    </section>
                </>
            )
            }
        </>
    )
}

export default SearchPage