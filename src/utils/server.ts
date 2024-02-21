import axios from "axios";
import env from "./constants";

export const axiosInstance = axios.create({
  baseURL: env.apiBaseURL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
