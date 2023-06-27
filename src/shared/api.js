import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  // baseURL: "http://vnoti.kr",
  baseURL: "http://vnoti.co.kr",
});

export const instance = axios.create({
  // baseURL: "http://vnoti.kr",
  baseURL: "http://vnoti.co.kr",
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    config.headers["Authorization"] = token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
