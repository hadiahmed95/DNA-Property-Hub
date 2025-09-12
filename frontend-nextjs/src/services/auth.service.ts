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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, credentials);
        return response.data;
    }

    logout(): void {
    }
}

export default new AuthService();
