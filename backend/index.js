// backend-nodejs/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const uploadRoutes = require('./routes/upload.route');
const db = require('./db'); // Ensure database connection is initialized

const app = express();

// --- CORS Configuration ---
const origins = [
  "http://localhost:5173", 
];

app.use(cors({
  origin: origins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
}));

// Init Middleware: Allows us to get the data in req.body
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes); // Authentication routes (signup, login)
app.use('/api/user', userRoutes); // Protected user routes (like /me)
app.use('/api/upload',uploadRoutes );//upload route

// live or not
app.get('/', (req, res) => {
  res.send('API is LIVE.');
});

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));