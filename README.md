# Authentication Module

This is a complete authentication module built with **PostgreSQL**, **Express.js**, and **React**, providing secure user authentication with features like signup, login, logout, password reset, email verification, and password change functionality. The module includes robust security measures to protect against common attacks while maintaining a good user experience.

## Features

- **User Authentication**:
  - Signup with email, password, and name
  - Login with email and password
  - Logout
  - JWT-based authentication with secure cookie storage
- **Password Management**:
  - Password reset via email with time-limited tokens
  - Password change for authenticated users
- **Email Verification**:
  - Verification email sent upon signup
  - Secure token-based email verification
- **Security Features**:
  - Backend:
    - SQL injection prevention with parameterized queries
    - Password hashing with bcrypt (12 salt rounds)
    - Input validation using express-validator
    - Rate limiting for API endpoints
    - CORS configuration
    - Helmet for security headers
    - Secure JWT generation and validation
    - HttpOnly, secure, and sameSite cookies
    - Crypto-secure tokens for email verification and password reset
  - Frontend:
    - Input sanitization to prevent XSS
    - Client-side form validation with server-side backup
    - Protected routes for authenticated users
    - Secure error handling
  - Database:
    - UUID primary keys to prevent enumerable IDs
    - Optimized indexing for performance

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, React Router, Axios
- **Dependencies**:
  - Backend: `express`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `pg`, `cors`, `helmet`, `express-rate-limit`, `express-validator`, `cookie-parser`, `dotenv`
  - Frontend: `axios`, `react-router-dom`
  - Development: `nodemon`

## Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** (for cloning the repository)
- **Email Service Account** (e.g., Gmail with App Password or a transactional email service like Mailgun)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auth-module
```

### 2. Backend Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up PostgreSQL Database**:
   - Ensure PostgreSQL is installed and running.
   - Create a database:
     ```bash
     psql -U <your-username> -c "CREATE DATABASE auth_db;"
     ```
   - Apply the database schema:
     ```bash
     psql -U <your-username> -d auth_db -f src/database/schema.sql
     ```
     The `schema.sql` file contains:
     ```sql
     -- Create the users table
     CREATE TABLE users (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         email VARCHAR(255) UNIQUE NOT NULL,
         password_hash VARCHAR(255) NOT NULL,
         name VARCHAR(255) NOT NULL,
         is_verified BOOLEAN DEFAULT FALSE,
         reset_token VARCHAR(255),
         reset_token_expires TIMESTAMP,
         verification_token VARCHAR(255)
     );

     -- Create indexes for better performance
     CREATE INDEX idx_users_email ON users(email);
     CREATE INDEX idx_users_reset_token ON users(reset_token);
     CREATE INDEX idx_users_verification_token ON users(verification_token);
     ```

4. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory based on `.env.example`:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://<username>:<password>@localhost:5432/auth_db
     JWT_SECRET=<your-secure-jwt-secret>
     JWT_EXPIRE=7d
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=<your-email@gmail.com>
     EMAIL_PASS=<your-app-password>
     CLIENT_URL=http://localhost:3000
     ```
   - Replace:
     - `<username>` and `<password>` with your PostgreSQL credentials.
     - `<your-secure-jwt-secret>` with a random, secure string (e.g., use `openssl rand -base64 32`).
     - `<your-email@gmail.com>` with your Gmail address.
     - `<your-app-password>` with a Gmail App Password (see below).
     - Keep `CLIENT_URL=http://localhost:3000` for local development.

5. **Generate a Gmail App Password** (if using Gmail):
   - Enable 2-factor authentication in your Google Account (https://myaccount.google.com/security).
   - Go to “App passwords,” select “Other (Custom name),” and enter a name (e.g., `Auth App Localhost`).
   - Generate and copy the 16-character App Password.
   - Set `EMAIL_PASS` to this value in the `.env` file.

6. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend Server**:
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`.

### 4. Testing the Application

- **Signup**: Go to `http://localhost:3000/signup` and create an account. Check your email for a verification link.
- **Email Verification**: Click the verification link in the email to verify your account.
- **Login**: Go to `http://localhost:3000/login` and log in with your credentials.
- **Dashboard**: After login, you’ll be redirected to `http://localhost:3000/dashboard` to view your profile or change your password.
- **Forgot Password**: Go to `http://localhost:3000/forgot-password` to request a password reset link.
- **Reset Password**: Click the reset link in the email to set a new password.

### 5. Project Structure

```
auth-module/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   └── auth.js
│   ├── services/
│   │   └── emailService.js
│   ├── db.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── EmailVerification.js
│   │   │   ├── ForgotPassword.js
│   │   │   ├── Login.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── ResetPassword.js
│   │   │   └── Signup.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── useInputSanitization.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── package.json
└── README.md
```

### 6. API Endpoints

- **POST /api/auth/signup**: Register a new user
- **POST /api/auth/login**: Authenticate a user
- **POST /api/auth/logout**: Log out a user
- **POST /api/auth/forgot-password**: Request a password reset
- **POST /api/auth/reset-password**: Reset password with token
- **GET /api/auth/verify-email**: Verify email with token
- **GET /api/auth/profile**: Get authenticated user’s profile (protected)
- **POST /api/auth/change-password**: Change password (protected)

### 7. Security Notes

- **Environment Variables**: Store sensitive data (e.g., `JWT_SECRET`, `EMAIL_PASS`) in the `.env` file and add `.env` to `.gitignore`.
- **Email Service**: Use a Gmail App Password for local testing. For production, consider a transactional email service like SendGrid or Mailgun.
- **Database**: Ensure your PostgreSQL database is properly configured with secure credentials.
- **Local Testing**: If emails aren’t needed for testing, you can log verification/reset URLs to the console by modifying `emailService.js`.

### 8. Deployment Considerations

- **Environment Variables**:
  ```env
  NODE_ENV=production
  DATABASE_URL=<your-production-db-url>
  JWT_SECRET=<your-secure-jwt-secret>
  JWT_EXPIRE=1d
  EMAIL_HOST=<your-smtp-host>
  EMAIL_PORT=587
  EMAIL_USER=<your-smtp-username>
  EMAIL_PASS=<your-smtp-password>
  CLIENT_URL=https://<your-frontend-domain>
  ```

- **Production Security**:
  - Use HTTPS for all connections.
  - Enable database SSL.
  - Implement logging and monitoring.
  - Use a secrets manager for sensitive data.
  - Consider shorter JWT expiration times and refresh tokens.

### 9. Troubleshooting

- **Database Connection Issues**:
  - Verify `DATABASE_URL` credentials and ensure the database exists.
  - Check if PostgreSQL is running (`pg_isready` or `psql -U <username>`).
- **Email Issues**:
  - Ensure `EMAIL_USER` and `EMAIL_PASS` are correct.
  - Verify your Gmail App Password or test with a service like Mailtrap.
- **CORS Errors**:
  - Ensure `CLIENT_URL` matches your frontend URL exactly (e.g., `http://localhost:3000`).
- **JWT Errors**:
  - Check that `JWT_SECRET` is consistent across requests and not changed mid-session.
