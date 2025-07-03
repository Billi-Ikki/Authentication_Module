import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid verification link');
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const result = await verifyEmail(token);
                setMessage(result.message);
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (error) {
                setError(error.response?.data?.message || 'Email verification failed');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token, verifyEmail, navigate]);

    return (
        <div className="auth-container">
            <div className="verification-result">
                <h2>Email Verification</h2>
                
                {loading && <div>Verifying your email...</div>}
                {error && <div className="error-message">{error}</div>}
                {message && (
                    <div className="success-message">
                        {message}
                        <p>Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;