import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {authService} from "./authService.ts";
import client from "../axios.ts";
import {StudentDto} from "../../types/StudentDto.ts";

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    student: StudentDto | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    profileCompleted: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [student, setStudent] = useState<StudentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadStudent = useCallback(async () => {
        try {
            const response = await client.get<StudentDto>('/api/v1/students/me');
            setStudent(response.data);
            setProfileCompleted(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setProfileCompleted(false);
        }
    }, []);

    const loadMe = useCallback(async () => {
        const me = await client.get('/api/v1/auth/me');
        setUser(me.data);
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                   await loadMe();
                   await loadStudent();
                   setLoading(false);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [loadMe, loadStudent]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            await authService.login({email, password});
            await loadMe();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            authService.logout();
            setUser(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed');
        }
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            await authService.register({email, password});
            await loadMe();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        student,
        isLoading: loading,
        error,
        login,
        logout,
        register,
        profileCompleted,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
