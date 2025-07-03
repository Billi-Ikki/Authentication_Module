const pool = require('../db');

class User {
    // Create a new user
    static async create({ email, passwordHash, name, verificationToken }) {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name, verification_token) VALUES ($1, $2, $3, $4) RETURNING id, email, name, is_verified',
            [email, passwordHash, name, verificationToken]
        );
        return result.rows[0];
    }

    // Find user by email
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Find user by reset token
    static async findByResetToken(token) {
        const result = await pool.query(
            'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
            [token, new Date()]
        );
        return result.rows[0];
    }

    // Find user by verification token
    static async findByVerificationToken(token) {
        const result = await pool.query('SELECT id FROM users WHERE verification_token = $1', [token]);
        return result.rows[0];
    }

    // Update password
    static async updatePassword(id, passwordHash) {
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
    }

    // Update reset token and expiration
    static async updateResetToken(email, resetToken, resetTokenExpires) {
        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [resetToken, resetTokenExpires, email]
        );
    }

    // Clear reset token
    static async clearResetToken(id) {
        await pool.query(
            'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1',
            [id]
        );
    }

    // Verify email
    static async verifyEmail(id) {
        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
            [id]
        );
    }
}

module.exports = User;