// backend-nodejs/routes/user.routes.js
const express = require('express');
const auth = require('../middlewares/auth'); // Your auth middleware
const db = require('../db');

const router = express.Router();

const pool = require('../db'); 

// PUT route to update user profile
// This route will be accessible at `/api/user/profile`
router.put('/profile', async (req, res) => {
  const {
    userId, // IMPORTANT: In a real app, get this from `req.user.id` after authentication.
    weight,
    height,
    bloodGroup,
    dateOfBirth,
    gender,
    allergies,
    currentMedications,
    chronicConditions
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required to update profile." });
  }

  try {
    const query = `
      UPDATE user_profiles
      SET
        weight = $1,
        height = $2,
        blood_group = $3,
        date_of_birth = $4,
        gender = $5,
        allergies = $6,
        current_medications = $7,
        chronic_conditions = $8
      WHERE user_id = $9
      RETURNING profile_id, user_id, weight, height, blood_group, date_of_birth, gender, allergies, current_medications, chronic_conditions, last_updated_at;
      -- Return only the fields from user_profiles table as they are the ones being updated
    `;
    const values = [
      // Use coalesce to ensure empty strings become NULL in DB, or handle on frontend
      weight || null,
      height || null,
      bloodGroup || null,
      dateOfBirth || null, // Ensure this is a valid date string or null
      gender || null,
      allergies || null,
      currentMedications || null,
      chronicConditions || null,
      userId // This maps to user_profiles.user_id
    ];

    // Execute the query using your PostgreSQL client (e.g., node-postgres)
    const result = await pool.query(query, values);

    // Check if any row was actually updated
    if (result.rowCount === 0) {
      // This means a profile for the given userId was not found.
      // This can happen if a user registers but no profile entry was created.
      // You might want to UPSERT (INSERT ON CONFLICT) here instead of just UPDATE.
      return res.status(404).json({ message: 'User profile not found. Consider creating one first.' });
    }

    const updatedProfile = result.rows[0];

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: updatedProfile // Send back the updated profile data from user_profiles table
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    // You might want to check for specific error codes (e.g., for data type mismatches)
    res.status(500).json({ message: 'Failed to update profile.', error: error.message });
  }
});

// @route   GET /api/user/me
// @desc    Get user by token (Protected Route)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is populated from the auth middleware
    const user = await db.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;