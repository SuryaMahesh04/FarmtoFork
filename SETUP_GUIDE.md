# Phase 1: Authentication System - Setup Guide

## Quick Start Instructions

Follow these steps to get the authentication system up and running.

### 1. Start MongoDB

Make sure MongoDB is installed and running on your system.

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# OR if installed via installer, it should auto-start
# Check if running by opening MongoDB Compass
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator

### 3. Configure Environment

The `.env` file is already created in the `backend` folder with these settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm2fork
JWT_SECRET=farm2fork_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

### 4. Start Backend Server

```bash
# From the backend folder
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### 5. Start Frontend (in a new terminal)

```bash
# From the project root
npm run dev
```

The frontend should start on `http://localhost:5173`

---

## Testing the Authentication Flow

### Test 1: Register a New User

1. Go to `http://localhost:5173/signup`
2. Click on **"Farmer"** role card
3. Fill in the onboarding form:
   - **Step 1 - Account Setup:**
     - Email: `test@farmer.com`
     - Password: `password123`
     - Confirm Password: `password123`
   
   - **Step 2 - Personal Details:**
     - Full Name: `Test Farmer`
     - Mobile: `+91 9876543210`
     - State: Select any state
     - District: Select any district
     - Village: `Test Village`
   
   - **Step 3 - Farm Details:**
     - Land Size: `5`
     - Land Type: Select any
     - Primary Crop: Select any
     - Organic Certified: Yes/No
   
   - **Step 4 - KYC & Bank:**
     - Aadhaar: `123456789012`
     - Bank Account: `1234567890`
     - IFSC Code: `SBIN0001234`
   
   - **Step 5 - Review:** Click Submit

4. You should be automatically logged in and redirected to `/farmer` dashboard

### Test 2: Login with Existing User

1. Go to `http://localhost:5173/login`
2. Select **"Farmer"** role
3. Enter credentials:
   - Email: `test@farmer.com`
   - Password: `password123`
4. Click **"Sign In"**
5. You should be redirected to `/farmer` dashboard

### Test 3: Role-Based Access

Try creating users with different roles:
- **Transporter**: Go to signup → Select Transporter → Complete onboarding
- **Distributor**: Go to signup → Select Distributor → Complete onboarding
- **Retailer**: Go to signup → Select Retailer → Complete onboarding

Each should navigate to their respective dashboards after registration.

---

## Verify in MongoDB

Check if users are being created:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Open database: `farm2fork`
4. Open collection: `users`
5. You should see your registered users

---

## API Testing (Optional)

Test the API directly using Postman or Thunder Client:

### Health Check
```http
GET http://localhost:5000/api/health
```

### Register
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "direct@test.com",
  "password": "password123",
  "role": "farmer"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "direct@test.com",
  "password": "password123",
  "role": "farmer"
}
```

Copy the `token` from response.

### Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Troubleshooting

### "MongoDB connection failed"
- Make sure MongoDB is running: `mongod` or check MongoDB Compass
- Check if port 27017 is available

### "Cannot connect to backend"
- Make sure backend server is running on port 5000
- Check console for errors

### "Login failed"
- Make sure you registered first
- Check email and password are correct
- Verify role selection matches your account

### "Token errors"
- Clear localStorage in browser DevTools
- Try registering again

---

## What's Working Now

✅ User registration (signup)
✅ User login with role selection  
✅ JWT token generation and storage
✅ Role-based dashboard navigation
✅ Protected routes (token verification)
✅ Password hashing (bcrypt)
✅ MongoDB user storage
✅ Onboarding flow integration

## Next Steps

Once authentication is working:
1. Add onboarding for other roles (transporter, distributor, retailer)
2. Implement batch creation (Phase 2)
3. Add shipment tracking (Phase 3)
4. Implement inventory management (Phase 4)
