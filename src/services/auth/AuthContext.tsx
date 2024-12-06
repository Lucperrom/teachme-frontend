import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {authService} from "./authService.ts";
import client from "../axios.ts";

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    await loadMe()
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                authService.logout();
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await authService.login({email, password});
            await loadMe();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadMe = async () => {
        const me = await client.get('/api/v1/auth/me');
        setUser(me.data);
    }

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
            setIsLoading(true);
            setError(null);
            await authService.register({email, password});
            await loadMe();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        user,
        isLoading,
        error,
        login,
        logout,
        register
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
