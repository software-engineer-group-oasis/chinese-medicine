import axios from 'axios'
import useAuthStore from "@/store/useAuthStore";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})
console.log('axiosInstance baseURL:', axiosInstance.defaults.baseURL);
// 请求拦截器：在每个请求头中添加 Authorization 字段
axiosInstance.interceptors.request.use(config => {
    // @ts-ignore
    const token = useAuthStore.getState().token;
    console.log("Authorization:", token);
    console.log("请求 config:", config);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default axiosInstance

