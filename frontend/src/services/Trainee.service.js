import httpPost from "../http-common-post"
import http from "../http-common"

class TraineeService{
    submitExercise(courseId, exerciseNum, traineeChoices){
        return httpPost.post("/trainee/submitExercise?courseId=" + courseId +"&exerciseNum=" + exerciseNum, {traineeChoices: traineeChoices});
    }
    getAnswers(courseId, exerciseNum) {
        return http.get("/trainee/getAnswers?courseId=" + courseId + "&exerciseNum=" + exerciseNum);
    }
}

export default new TraineeService();