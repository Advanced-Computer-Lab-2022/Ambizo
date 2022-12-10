import http from "../http-common-post"

class SignUpService{

    addIndividualTrainee(traineeData) {
        return http.post("/guest/addIndividualTrainee", traineeData);
    }
}

export default new SignUpService();