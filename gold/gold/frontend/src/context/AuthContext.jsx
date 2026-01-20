import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.log('Not authenticated');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            if (response.data.success) {
                setUser(response.data.user);
                return response.data.user;
            } else {
                throw new Error(response.data.error || 'Signup failed');
            }
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Signup failed');
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                setUser(response.data.user);
                return response.data.user;
            } else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
