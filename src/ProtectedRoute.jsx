
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    const [error, setError] = useState(null);
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkToken = async (token) => {
            try {
                const response = await axios.post('/api/identity/auth/introspect', { token });
                const isValid = response.data.data.valid;

                setIsValidToken(isValid);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
                setLoading(false);

            }
        };
    
        if (!token) {
            setLoading(false);
            // return <Navigate to="/" replace />;
        
        } else {
            checkToken(token);
        }
    }, [token]);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!isValidToken) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;