import http from "../http-common-post"
import httpPost from "../http-common-post";

class AdministratorService {
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
        return httpPost.put("/admin/updatereportstatus/?reportId=" + reportId, { Status: status });
    }
    applyDiscount(courses, discountPercentage, expiryDate) {
        return httpPost.put("/admin/applyDiscount/?courses=" + courses + "&discount=" + discountPercentage + "&expiryDate=" + expiryDate)
    }
    getAllAccessRequests() {
        return http.get("/admin/getAllAccessRequests")
    }
    grantAccess(corporateUsername, courseId) {
        return httpPost.post("/admin/grantAccess/?corporateUsername=" + corporateUsername + "&courseId=" + courseId)
    }
    declineAccess(corporateUsername, courseId) {
        return httpPost.post("/admin/declineAccess/?corporateUsername=" + corporateUsername + "&courseId=" + courseId)
    }
}

export default new AdministratorService();