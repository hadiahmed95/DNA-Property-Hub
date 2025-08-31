import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    toast.error('Session expired. Please login again.');
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action');
                    break;
                case 422:
                    toast.error('Please check your input data');
                    break;
                case 500:
                    toast.error('Server error. Please try again later');
                    break;
                default:
                    toast.error('Something went wrong. Please try again.');
            }
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default api;
