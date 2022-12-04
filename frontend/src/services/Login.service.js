import http from "../http-common"
import httpPost from "../http-common-post"

class LoginService{
    getLoggedInUserData() {
        return http.get("/user/getLoggedInUserData");
    }

    login(userData){
        return httpPost.post("/user/login", userData)
    }

    requestPasswordReset(userData){
        return httpPost.post("/user/requestPasswordReset", userData);
    }

    resetPassword(userData, resetToken){
        return httpPost.post(
            "/user/resetPassword", 
            userData,
        )
    }
    changePassword(userData){
        return httpPost.post(
            '/user/changePassword',
            userData,
        )
    }
}

export default new LoginService();