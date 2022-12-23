import httpPost from "../http-common-post"
import http from "../http-common"

class TraineeService{
    submitExercise(courseId, exerciseNum, traineeChoices){
        return httpPost.post("/trainee/submitExercise?courseId=" + courseId +"&exerciseNum=" + exerciseNum, {traineeChoices: traineeChoices});
    }
    getAnswers(courseId, exerciseNum) {
        return http.get("/trainee/getAnswers?courseId=" + courseId + "&exerciseNum=" + exerciseNum);
    }

    rateCourse(courseId, rating){
        return httpPost.post(`/trainee/rateCourse/${courseId}`, rating);
    }

    updateCourseRating(courseId, newRating){
        return httpPost.put(`/trainee/updateCourseRating/${courseId}`, newRating);
    }

    deleteCourseRating(courseId){
        return httpPost.delete(`/trainee/deleteCourseRating/${courseId}`);
    }

    rateInstructor(instructorUsername, rating){
        return httpPost.post(`/trainee/rateInstructor/${instructorUsername}`, rating);
    }

    updateInstructorRating(instructorUsername, newRating){
        return httpPost.put(`/trainee/updateInstructorRating/${instructorUsername}`, newRating);
    }

    deleteInstructorRating(instructorUsername){
        return httpPost.delete(`/trainee/deleteInstructorRating/${instructorUsername}`);
    }
    
    getTraineeData(TraineeUsername){
        return http.get(`/trainee/getTraineeInfo/${TraineeUsername}`);
    }

    getTraineeName(TraineeUsername) {
        return http.get("/trainee/getTraineeName/?traineeUsername=" + TraineeUsername);
    }

    requestRefund(courseId, reason, description) {
        return httpPost.post("/individualTrainee/requestRefund/?courseId=" + courseId, {reason:reason, description: description});
    }

    getRefundStatus(courseId) {
        return http.get("/individualTrainee/getRefundStatus/?courseId=" + courseId);
    }

    updateSubtitleProgress(courseId, subtitleNum, newProgress) {
        return httpPost.put("/trainee/updateSubtitleProgress/?courseId=" + courseId + "&subtitleNum=" + subtitleNum, {newProgress: newProgress});
    }

    checkIfAlreadyRequestedCourse(courseId) {
        return http.get("/corporateTrainee/checkIfAlreadyRequestedCourse/?courseId=" + courseId);
    }

    requestCourse(courseId, courseTitle) {
        return httpPost.post("/corporateTrainee/requestCourse/?courseId=" + courseId + "&courseTitle=" + courseTitle);
    }

    cancelRequest(courseId) {
        return httpPost.put("/corporateTrainee/cancelRequest/?courseId=" + courseId);
    }
}

export default new TraineeService();