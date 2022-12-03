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

    getTraineeName(TraineeUsername) {
        return http.get("/trainee/getTraineeName/?traineeUsername=" + TraineeUsername);
    }
}

export default new TraineeService();