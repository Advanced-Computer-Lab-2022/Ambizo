import React from "react";
import Header from "../Header/Header";
import CourseHeader from "../Course/CoursesHeader";
import CountryModal from "../CountryModal/CountryModal";
import FilterModal from "../FilterModal/FilterModal";
import Course from "../Course/Course";
import CourseService from "../../services/Course.service";

async function retrieveAllCourses(){
    // const response = await CourseService.getAllCourses();
    // return response.data;
    return CourseService.getAllCourses()
    .then((result) => {
        return result;
    })
    .catch((error) => {
        return null;
    })
}

function Homepage() {

    const [countryModal, setCountryModal] = React.useState(false);

    const toggleCountryModal = () => {
        setCountryModal(prevModal => !prevModal);
    };

    const [filterModal, setFilterModal] = React.useState(false);

    const toggleFilterModal = () => {
        setFilterModal(prevModal => !prevModal);
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

    return (
        <>
            <Header toggleCountryModal={toggleCountryModal} />
            <CourseHeader toggleFilterModal={toggleFilterModal} />
            <section className="courses-list">
                {coursesDataElements}
            </section>
            <CountryModal countryModal={countryModal} toggleCountryModal={toggleCountryModal} />
            <FilterModal filterModal={filterModal} toggleFilterModal={toggleFilterModal} />
        </>
    )
}

export default Homepage;