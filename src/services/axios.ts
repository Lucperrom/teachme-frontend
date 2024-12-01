import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {authService} from "./auth/authService.ts";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authService.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;