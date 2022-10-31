import http from "../http-common"
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
}

export default new InstructorService();