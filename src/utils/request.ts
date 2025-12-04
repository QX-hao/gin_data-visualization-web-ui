import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 后端API服务地址配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

const service: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

// 相应拦截器
service.interceptors.response.use(
    // 成功回调：所有 2xx 状态码都会进入这里
    (response: AxiosResponse) => {
        // 所有2xx状态码都视为成功
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            return Promise.reject(new Error(`请求失败，状态码: ${response.status}`));
        }
    },

    // 失败回调：所有非 2xx 状态码都会进入这里
    (error: AxiosError) => {

        // 不再抛出异常，而是直接返回 error.response 对象
        // 这样，业务代码（如 login.vue）的 await 就能接收到这个对象
        // 并且可以访问 error.response.status 和 error.response.data
        if (error.response ) {
            return error.response;
        }

        // 如果 error.response 不存在，说明是网络错误（比如断网）或客户端错误
        // 这种情况下，我们仍然抛出异常，让业务代码的 catch 块来处理
        return Promise.reject(error);
    }
);

export default service;