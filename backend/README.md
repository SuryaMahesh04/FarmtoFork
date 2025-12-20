# Farm2Fork Backend API

Backend server for the Farm2Fork agricultural supply chain platform using MongoDB with simulated blockchain (hash generation).

## Technology Stack

- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend folder (copy from .env.example if available):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farm2fork
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# Mac/Linux
sudo service mongod start
```

### 4. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (protected)
- **PUT** `/api/auth/profile` - Update user profile (protected)

### Health Check

- **GET** `/api/health` - Server health status

## Testing with Postman/Thunder Client

### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "farmer@test.com",
  "password": "password123",
  "role": "farmer"
}
```

### Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "farmer@test.com",
  "password": "password123",
  "role": "farmer"
}
```

Copy the `token` from the response and use it in subsequent requests.

### Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Auth logic
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── models/
│   │   └── User.js           # User schema
│   ├── routes/
│   │   └── auth.js           # Auth routes
│   └── server.js             # Main server file
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Next Steps

1. Test authentication endpoints
2. Integrate with frontend
3. Add onboarding endpoints
4. Implement batch/shipment features
