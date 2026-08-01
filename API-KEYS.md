# API Keys & Configuration Guide

## Overview
This document outlines all API keys, secrets, and configuration variables used in the RxConnect Pharmacy Platform.

---

## Environment Variables

### Backend (.env)
Located at: `backend/.env`

```env
DATABASE_URL="postgresql://neondb_owner:npg_bD8P6dRTphrq@ep-bold-tooth-ax4p3y72.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=your_secret_key
PORT=5001
```

#### Environment Variables Breakdown:

| Variable | Value | Purpose | Usage |
|----------|-------|---------|-------|
| `DATABASE_URL` | PostgreSQL Connection String | Database connection for Neon PostgreSQL | Prisma ORM connection |
| `JWT_SECRET` | Secret key for token signing | Authentication token encryption | JWT token generation & validation |
| `PORT` | 5001 | Server port (avoids Windows port 5000 conflict) | Express server listening port |

### Frontend (.env.local)
Located at: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### Frontend Variables:

| Variable | Value | Purpose | Usage |
|----------|-------|---------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001` | Backend API base URL | API endpoint for all frontend requests |

---

## Database Configuration

### PostgreSQL (Neon Cloud)
- **Provider**: Neon Cloud
- **Connection String**: `postgresql://neondb_owner:npg_bD8P6dRTphrq@ep-bold-tooth-ax4p3y72.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require`
- **Region**: US-East-2
- **SSL Mode**: Required
- **Database Name**: `neondb`
- **Owner**: `neondb_owner`

---

## JWT (JSON Web Tokens)

### Configuration
- **Secret Key**: Stored in `JWT_SECRET` environment variable
- **Default Fallback**: `"rxconnect_secret_key"` (used if env var not set)
- **Expiration**: 7 days
- **Token Claims**: `{ id, role, email }`

### JWT Flow
1. **Generation** (`authController.js`):
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || "rxconnect_secret_key";
   const token = jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: "7d" });
   ```

2. **Verification** (`authMiddleware.js`):
   ```javascript
   const decoded = jwt.verify(token, process.env.JWT_SECRET || "rxconnect_secret_key");
   ```

3. **Storage** (Frontend):
   - Tokens stored in `localStorage` as `rxconnect_token`
   - Sent in Authorization header: `Bearer {token}`

---

## CORS (Cross-Origin Resource Sharing)

### Configuration (server.js)
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || "http://localhost:3000"
    : true,
  credentials: true,
};
```

### Rules
- **Production**: Uses `FRONTEND_URL` env variable or defaults to `http://localhost:3000`
- **Development**: Allows all origins (`true`)
- **Credentials**: Enabled for cookie/auth header support

---

## API Endpoints Authentication

All API endpoints follow this authentication pattern:

### Protected Routes (Require Auth)
- All routes except login/signup
- Require JWT token in Authorization header

### Example Request
```javascript
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};
```

### Roles-Based Access Control
```
Customer: Can access orders, prescriptions, medicines, notifications
Pharmacist: Can access prescriptions, medicines, inventory, notifications
Delivery Partner: Can access deliveries, orders, history, notifications
Admin: Can access all resources (users, medicines, inventory, analytics)
```

---

## Security Best Practices

### ✅ DO:
- Keep `JWT_SECRET` secure in `.env` (never commit to git)
- Use strong JWT secrets in production (minimum 32 characters)
- Rotate JWT secrets periodically
- Use HTTPS in production
- Store tokens only in secure storage (localStorage/sessionStorage)
- Validate all incoming requests

### ❌ DON'T:
- Expose `.env` files in version control
- Use default/weak JWT secrets in production
- Store sensitive data in tokens
- Log JWT tokens or passwords
- Hardcode credentials in source code

---

## Environment Setup

### Local Development

1. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env  # if available
   # Edit .env with your values
   npm install
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   cp .env.local.example .env.local  # if available
   # Edit .env.local with your values
   npm install
   npm run dev
   ```

### Production Deployment

1. Set all environment variables on deployment platform:
   - Heroku: Config Vars
   - AWS: Environment Variables or Secrets Manager
   - GCP: Cloud Run environment variables
   - Docker: Docker compose `.env` file

2. Change default values:
   ```env
   DATABASE_URL=your_production_database_url
   JWT_SECRET=very_strong_random_secret_here
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   PORT=8080 (or as needed)
   ```

---

## Backend Port Configuration

### Current Setup
- **Development Port**: 5001
- **Reason**: Windows reserves port 5000 for system services
- **Configurable**: Via `PORT` environment variable

### Override Port
```env
PORT=3000  # or any available port
```

---

## Frontend API Configuration

### Development
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Production
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### API Calls Example
```javascript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines`)
```

---

## Token Storage (Frontend)

### Storage Location
- **Key**: `rxconnect_token`
- **Storage Type**: Browser localStorage
- **Access**: `localStorage.getItem("rxconnect_token")`

### Token Lifecycle
1. Generated on successful login
2. Stored in localStorage
3. Sent with every authenticated request
4. Cleared on logout
5. Auto-validated on app load

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid token" | JWT secret mismatch | Verify JWT_SECRET matches across app |
| "CORS error" | Frontend URL not whitelisted | Update CORS origin settings |
| "Connection refused" | Database unreachable | Check DATABASE_URL and network |
| "Auth failed" | Missing/expired token | Login again to get new token |
| "Port 5001 in use" | Another service using port | Change PORT in .env or stop service |

---

## File Locations Reference

```
RxConnect/
├── .env (Root - Database & JWT)
├── backend/
│   ├── .env (Backend specific - JWT_SECRET, PORT)
│   ├── server.js (CORS config)
│   ├── controllers/
│   │   └── authController.js (JWT token generation)
│   └── middleware/
│       └── authMiddleware.js (JWT token verification)
└── frontend/
    └── .env.local (API_URL config)
```

---

**Last Updated**: August 1, 2026
**Version**: 1.0
