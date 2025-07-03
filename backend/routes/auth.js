const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
    validateSignup,
    validateLogin,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
    handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);
router.get('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, validateChangePassword, handleValidationErrors, changePassword);

module.exports = router;