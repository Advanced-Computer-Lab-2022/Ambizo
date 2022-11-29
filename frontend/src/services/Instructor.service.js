import http from "../http-common"
import httpPost from "../http-common-post"
import countryToCurrency  from 'country-to-currency';

class InstructorService {
    getAllCourses() {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourses/?currencyCode=" + currencyCode);
    }
    getFilteredCourses(filterURL) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourses/" + filterURL + "&currencyCode=" + currencyCode);
    }
    addCourse(courseData) {
        return httpPost.post("/instructor/createCourse", courseData);
    }
    searchCourses(searchTerm) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/searchCourses/" + searchTerm + "?currencyCode=" + currencyCode);
    }
    addSubtitleDetails(index, newSubtitle, courseId) {
        return httpPost.put("/instructor/addSubtitleDetails/?courseId=" + courseId + "&index=" + index, newSubtitle);
    }
    addCoursePreview(previewLink, courseId) {
        return httpPost.put("/instructor/addCoursePreview/?courseId=" + courseId, {previewLink: previewLink});
    }
}

export default new InstructorService();