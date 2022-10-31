import http from "../http-common"
import countryToCurrency  from 'country-to-currency';

class CourseService {
    getAllCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/getCourses/?currencyCode=" + currencyCode);
    }

    getFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("guest/getCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }

    getCourse(courseId) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/getCourse/" + courseId + "?currencyCode=" + currencyCode);
    }
}

export default new CourseService();