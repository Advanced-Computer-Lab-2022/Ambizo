import React from "react";
import Header from "../Header/Header";
import CourseHeader from "../Course/CoursesHeader";
import CountryModal from "../CountryModal/CountryModal";
import FilterModal from "../FilterModal/FilterModal";
import Course from "../Course/Course";
import CourseService from "../../services/Course.service";

async function retrieveAllCourses(){
    return CourseService.getAllCourses()
    .then((result) => {
        return result;
    })
    .catch((error) => {
        return null;
    })
}

async function retrieveFilteredCourses(filterURL){
    console.log(filterURL)
    return CourseService.getFilteredCourses(filterURL)
    .then((result) => {
        return result;
    })
    .catch((error) => {
        return null;
    })
}

function CoursesPage() {

    const [countryModal, setCountryModal] = React.useState(false);

    const toggleCountryModal = () => {
        setCountryModal(prevModal => !prevModal);
    };

    const [filterModal, setFilterModal] = React.useState(false);

    const toggleFilterModal = () => {
        setFilterModal(prevModal => !prevModal);
        resetFilters();
    };

    const [coursesData, setCoursesData] = React.useState([]);

    React.useEffect(() => {
        document.title = "Homepage";
        retrieveAllCourses()
        .then(coursesList => setCoursesData(coursesList.data))
        .catch(error => {
            console.log(error);
        })
    }, []);

    const coursesDataElements = coursesData.map(course => {
        return (
            <Course
                {...course}
                coursesData={coursesData}
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
            retrieveFilteredCourses(filterURL)
            .then(coursesList => setCoursesData(coursesList.data))
            .catch(error => {
                console.log(error);
            })
            toggleFilterModal(); 
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

    return (
        <>
            <Header toggleCountryModal={toggleCountryModal} />
            <CourseHeader toggleFilterModal={toggleFilterModal} />
            <section className="courses-list">
                {coursesDataElements}
            </section>
            <CountryModal countryModal={countryModal} toggleCountryModal={toggleCountryModal} />
            <FilterModal filterModal={filterModal} toggleFilterModal={toggleFilterModal} 
            onSelectSubjects={onSelectSubjects} onSelectRating={onSelectRating} priceFilterData={priceFilterData} 
            handlePriceFilterChange={handlePriceFilterChange} applyFilters={applyFilters} resetFilters={resetFilters} />
        </>
    )
}

export default CoursesPage;