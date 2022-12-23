import http from "../http-common-post"
import httpPost from "../http-common-post";

class AdministratorService{
    addAdmin(AdminData) {
        return http.post("/admin/addAdministrator", AdminData);
    }
    addTrainee(traineeData) {
        return http.post("/admin/addCorporateTrainee", traineeData);
    }
    addInstructor(instructorData) {
        return http.post("/admin/addInstructor", instructorData);
    }
    getAllReports() {
        return http.get(`/admin/getAllReports/`);
    }
    updateReportStatus(reportId, status) {
        return httpPost.put("/admin/updatereportstatus/?reportId=" + reportId, {Status: status});
    }
}

export default new AdministratorService();