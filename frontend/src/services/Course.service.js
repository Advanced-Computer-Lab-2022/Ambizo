import http from "../http-common"

class CourseService {
    getAllCourses(){
        return http.get("/guest/getCourses");
    }

    getFilteredCourses(filterURL) {
        return http.get("guest/getCourses/" + filterURL);
    }
}

export default new CourseService();