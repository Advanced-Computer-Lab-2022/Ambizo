import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {}
});

apiClient.interceptors.request.use(function (config) {
    config.headers["Authorization"] = sessionStorage.getItem("Token");
    return config;
});

export default apiClient;