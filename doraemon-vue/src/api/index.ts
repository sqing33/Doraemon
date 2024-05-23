export const InterfaceUrl: string = "http://localhost:3000";

// 外部设备访问地址
// export const InterfaceUrl: string = "http://192.168.31.74:3000";
// export const InterfaceUrl: string = "http://101.34.255.5:3000";

import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

const _axios = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10 * 1000,
});

// 请求拦截器
_axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    let url = config.url || "";
    let whiteList = ["/news"];
    if (whiteList.includes(url) == false && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("登录失效，请重新登录");
          router.push("/login");
          break;
        case 403:
          ElMessage.error("权限不足，请联系管理员");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error("请求错误");
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default _axios;
