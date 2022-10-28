import http from "../http-common-post"

class AdministratorService{
    addAdmin(AdminData) {
        return http.post("/admin/addAdministrator", AdminData);
    }
    addTrainee(traineeData) {
        return http.post("/admin/addTrainee", traineeData);
    }
    addInstructor(instructorData) {
        return http.post("/admin/addInstructor", instructorData);
    }
}

export default new AdministratorService();