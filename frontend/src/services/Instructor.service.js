import http from "../http-common"
import httpPost from "../http-common-post"
import countryToCurrency  from 'country-to-currency';

class InstructorService {
    getAllCourses() {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourses/?currencyCode=" + currencyCode);
    }
    getInstructorCourses(instructorUsername) {
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getInstructorCourses/?instrusername=" + instructorUsername + "&currencyCode=" + currencyCode);
    }
    getInstructorInfo(instructorUsername) {
        return http.get("/instructor/getInstructorInfo/?instrusername=" + instructorUsername);
    }
    updateEmail(updatedEmail) {
        return httpPost.put("/instructor/updateEmail/?updatedEmail=" + updatedEmail)
    }
    updateBio(enteredBio) {
        return httpPost.put("/instructor/updateBio/?enteredBio=" + enteredBio)
    }
    checkIfInstructor(username) {
        return http.get("/instructor/checkIfInstructor/?username=" + username)
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
    addExercise(courseId, exerciseNum, newExercise) {
        return httpPost.post("/instructor/addExercise/?courseId=" + courseId + "&exerciseNum=" + exerciseNum, {newExercise: newExercise});
    }
    addCoursePreview(previewLink, courseId) {
        return httpPost.put("/instructor/addCoursePreview/?courseId=" + courseId, {previewLink: previewLink});
    }
    isContractAccepted(){
        return http.get("/instructor/isContractAccepted");
    }
    acceptContract(){
        return httpPost.put("/instructor/acceptContract");
    }
    getCourseDetails(courseId){
        let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";
        return http.get("/instructor/getCourseDetails/?courseId=" + courseId + "&currencyCode=" + currencyCode);
    }
}

export default new InstructorService();