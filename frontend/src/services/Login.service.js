import http from "../http-common"
import httpPost from "../http-common-post"

class LoginService{
    getLoggedInUserData() {
        return http.get("/user/getLoggedInUserData");
    }

    login(userData){
        return httpPost.post("/user/login", userData)
    }
}

export default new LoginService();