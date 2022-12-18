import http from "../http-common-post"
import httpPost from "../http-common-post"

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
    applyDiscount(courses, discountPercentage, expiryDate) {
        return httpPost.put("/admin/applyDiscount/?courses=" + courses + "&discount=" + discountPercentage + "&expiryDate=" + expiryDate)
    }
}

export default new AdministratorService();