import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 后端API服务地址配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

const service: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 所有2xx状态码都视为成功
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            return Promise.reject(new Error(`请求失败，状态码: ${response.status}`));
        }
    },
    (error: AxiosError) => {
        console.log('请求错误:', error);
        return Promise.reject(error);
    }
);

export default service;