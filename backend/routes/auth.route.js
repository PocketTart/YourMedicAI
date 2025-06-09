// backend-nodejs/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Your database connection
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to fetch full user data (including profile)
// This avoids code duplication in login and signup
async function getFullUserData(userId) {
  const query = `
    SELECT
        u.id AS user_id,
        u.username,
        u.email,
        up.weight,
        up.height,
        up.blood_group,
        up.date_of_birth,
        up.gender,
        up.allergies,
        up.current_medications,
        up.chronic_conditions,
        up.profile_id -- Include profile_id for frontend if needed
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows[0];
}

// @route   POST /api/auth/signup
// @desc    Register user & get token
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists by email
    let userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if username already exists
    userExists = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Start Transaction ---
    // It's good practice to use a transaction when inserting into multiple tables
    // so if one fails, both are rolled back.
    await db.query('BEGIN');

    // 1. Save user to 'users' table
    const newUserResult = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    const newUserId = newUserResult.rows[0].id;

    // 2. Create corresponding entry in 'user_profiles' table
    // All other fields in user_profiles will be NULL by default
    await db.query(
      'INSERT INTO user_profiles (user_id) VALUES ($1)',
      [newUserId]
    );

    await db.query('COMMIT'); // --- End Transaction ---

    // 3. Fetch the complete user object including newly created profile (which will have NULLs)
    const fullUserData = await getFullUserData(newUserId);

    // Create JWT payload
    const payload = {
      user: {
        id: fullUserData.user_id, // Use user_id from the joined data
        username: fullUserData.username,
        email: fullUserData.email,
        // Include all profile fields in the token's user payload
        weight: fullUserData.weight,
        height: fullUserData.height,
        bloodGroup: fullUserData.blood_group,
        dateOfBirth: fullUserData.date_of_birth,
        gender: fullUserData.gender,
        allergies: fullUserData.allergies,
        currentMedications: fullUserData.current_medications,
        chronicConditions: fullUserData.chronic_conditions,
        profile_id: fullUserData.profile_id,
      },
    };

    // Sign the token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send token and the comprehensive user data including profile fields
        res.json({ token, user: payload.user });
      }
    );

  } catch (err) {
    await db.query('ROLLBACK'); // Rollback transaction on error
    console.error("Signup error:", err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Fetch user by email including their password for comparison
    let userAuthData = await db.query('SELECT id, username, email, password FROM users WHERE email = $1', [email]);
    if (userAuthData.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const userId = userAuthData.rows[0].id; // Get the user's ID
    const hashedPassword = userAuthData.rows[0].password;

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. Ensure user_profiles entry exists, create if not (for existing users from old schema)
    let profileExists = await db.query('SELECT profile_id FROM user_profiles WHERE user_id = $1', [userId]);

    if (profileExists.rows.length === 0) {
      // Profile does not exist, create it.
      console.log(`Creating profile for user ID: ${userId}`);
      await db.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [userId]);
    }

    // 4. Fetch the complete user object including profile data (newly created or existing)
    const fullUserData = await getFullUserData(userId);

    // 5. Create JWT payload with comprehensive user data
    const payload = {
      user: {
        id: fullUserData.user_id,
        username: fullUserData.username,
        email: fullUserData.email,
        // Include all profile fields
        weight: fullUserData.weight,
        height: fullUserData.height,
        bloodGroup: fullUserData.blood_group,
        dateOfBirth: fullUserData.date_of_birth,
        gender: fullUserData.gender,
        allergies: fullUserData.allergies,
        currentMedications: fullUserData.current_medications,
        chronicConditions: fullUserData.chronic_conditions,
        profile_id: fullUserData.profile_id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;