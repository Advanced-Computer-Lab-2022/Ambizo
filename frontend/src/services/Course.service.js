import http from "../http-common"

class CourseService {
    getAllCourses(){
        return http.get("/guest/getCourses");
    }
}

export default new CourseService();