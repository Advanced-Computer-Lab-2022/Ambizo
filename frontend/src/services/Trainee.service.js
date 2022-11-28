import httpPost from "../http-common-post"

class TraineeService{
    submitExercise(courseId, exerciseNum, traineeChoices){
        return httpPost.post("/trainee/submitExercise?courseId=" + courseId +"&exerciseNum=" + exerciseNum, {traineeChoices: traineeChoices});
    }
}

export default new TraineeService();