import http from "../http-common"
import httpPost from "../http-common-post";

import countryToCurrency  from 'country-to-currency';

class CourseService {
    getAllCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/getCourses/?currencyCode=" + currencyCode);
    }

    getPopularCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/getPopularCourses/?currencyCode=" + currencyCode);
    }

    getFilteredPopularCourses(filterURL){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/getPopularCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }

    getNotDiscountedCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/admin/getNotDiscountedCourses/?currencyCode=" + currencyCode);
    }

    getDiscountedCourses(){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/admin/getDiscountedCourses/?currencyCode=" + currencyCode);
    }

    getFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("guest/getCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }

    getNotDiscountedFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/admin/getNotDiscountedCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }

    getDiscountedFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/admin/getDiscountedCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }

    getCourse(courseId, traineeUsername) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return httpPost.post("/guest/getCourse/" + courseId + "?currencyCode=" + currencyCode, {TraineeUsername: traineeUsername});
    }

    searchCourses(searchTerm){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/guest/searchCourses/" + searchTerm + "?currencyCode=" + currencyCode);
    }

    getExercise(courseId, exerciseNum){
        return http.get("/user/getExercise?courseId=" + courseId +"&exerciseNum=" + exerciseNum);
    }

    getSubtitleName(courseId, subtitleNum){
        return http.get("/guest/getSubtitleName?courseId=" + courseId +"&subtitleNum=" + subtitleNum);
    }
}

export default new CourseService();