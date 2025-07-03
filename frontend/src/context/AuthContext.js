import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/auth/profile');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        const response = await axios.post('/auth/signup', userData);
        return response.data;
    };

    const login = async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    const changePassword = async (passwordData) => {
        const response = await axios.post('/auth/change-password', passwordData);
        return response.data;
    };

    const forgotPassword = async (email) => {
        const response = await axios.post('/auth/forgot-password', { email });
        return response.data;
    };

    const resetPassword = async (token, password) => {
        const response = await axios.post('/auth/reset-password', { token, password });
        return response.data;
    };

    const verifyEmail = async (token) => {
        const response = await axios.get(`/auth/verify-email?token=${token}`);
        await checkAuth(); // Refresh user data
        return response.data;
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};