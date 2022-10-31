import http from "../http-common"
import httpPost from "../http-common-post"

class LoginService{
    getUserType(userData) {
        return http.get("/guest/getUserType/" + userData.username);
    }

    login(userData, type){
        return httpPost.post("/" + type + "/login/", userData)
    }
}

export default new LoginService();