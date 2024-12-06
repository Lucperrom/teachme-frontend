import client from "../axios";

interface Credentials {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export const authService = {
    async login(credentials: Credentials) {
        const response = await client.post<AuthResponse>('/api/v1/auth/signin', credentials);
        this.setToken(response.data.token);
        window.location.href = '/home';
        return response.data;
    },

    async register(userData: Credentials) {
        const response = await client.post<AuthResponse>('/register', userData);
        this.setToken(response.data.token);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};