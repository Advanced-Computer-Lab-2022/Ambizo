import http from "../http-common"
import httpPost from "../http-common-post"
import countryToCurrency  from 'country-to-currency';

class InstructorService {
    getAllCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourses/?currencyCode=" + currencyCode + "&username=" + JSON.parse(sessionStorage.getItem("User")).Username);
    }
    getFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourses/" + filterURL + "&currencyCode=" + currencyCode + "&username=" + JSON.parse(sessionStorage.getItem("User")).Username);
    }
    addCourse(courseData) {
        let user = JSON.parse(sessionStorage.getItem("User"))
        return httpPost.post("/instructor/createCourse/?username=" + user.Username + "&name="+ user.Name, courseData);
    }
}

export default new InstructorService();