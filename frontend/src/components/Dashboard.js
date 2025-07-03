import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useInputSanitization from '../hooks/useInputSanitization';

const Dashboard = () => {
    const { user, logout, changePassword } = useAuth();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { sanitizeObject } = useInputSanitization();

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const sanitizedData = sanitizeObject({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            const result = await changePassword(sanitizedData);
            setMessage(result.message);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowChangePassword(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Password change failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="user-info">
                <h2>Welcome, {user?.name}!</h2>
                <p>Email: {user?.email}</p>
                <p>Status: {user?.isVerified ? 'Verified' : 'Not Verified'}</p>
                {!user?.isVerified && (
                    <div className="verification-notice">
                        Please check your email to verify your account.
                    </div>
                )}
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-actions">
                <button 
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="action-btn"
                >
                    Change Password
                </button>
            </div>

            {showChangePassword && (
                <form onSubmit={handleChangePasswordSubmit} className="change-password-form">
                    <h3>Change Password</h3>
                    
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowChangePassword(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Dashboard;