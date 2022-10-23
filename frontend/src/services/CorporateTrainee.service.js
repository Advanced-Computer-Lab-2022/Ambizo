import http from "../http-common";

class CorporateTraineeService{
    getTrainee(id){
        return http.get("/corporateTrainee/" + id);
    }

    getAllTrainees(){
        return http.get("/corporateTrainee/getAllTrainees");
    }

    getTraineeId(username){
        return http.get("/corporateTrainee/getTraineeId/" + username);
    }

    addTrainee(traineeData){
        return http.post("/addTrainee", traineeData);
    }
}

export default new CorporateTraineeService();