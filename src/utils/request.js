import axios from 'axios';
import router from "@/router";
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://47.113.109.49:6001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

request.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (!token && !config.url.endsWith('/login')) {
            router.push('/login');
        }
        if (token) {
            config.headers['authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return checkCode(error);
    }
);

function checkCode(res) {
    if (res.response.status === 401) {
        ElMessage.error(res.response.data.message);
        sessionStorage.removeItem('token');
        router.push('/login');
        return res.response;
    }
    return res;
}

export default request;