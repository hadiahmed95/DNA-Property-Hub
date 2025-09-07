import axios from 'axios';
import { API_BASE_URL } from './api';
export interface LoginCredentials {
    email: string;
    password: string;
    remember_me?: boolean;
}

export interface AuthResponse {
    access_token: string;
    user: any;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default new AuthService();
