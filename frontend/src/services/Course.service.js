import http from "../http-common"
import countryToCurrency  from 'country-to-currency';

class CourseService {
    getAllCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ];
        if(!currencyCode){
            currencyCode = "USD"
        }
        return http.get("/guest/getCourses/?currencyCode=" + currencyCode);
    }

    getFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ];
        if(!currencyCode){
            currencyCode = "USD"
        }
        return http.get("guest/getCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }
}

export default new CourseService();