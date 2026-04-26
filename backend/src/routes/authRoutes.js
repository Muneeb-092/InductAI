const express = require('express');
const router = express.Router();
const { 
  registerRecruiter, 
  loginRecruiter, 
  updateProfile 
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { forgotPassword, resetPassword } = require('../controllers/authController');
// --- PUBLIC ROUTES ---
// No token needed to join or sign in
router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- PROTECTED ROUTES ---
// The verifyToken middleware ensures only the logged-in recruiter 
// can change their own profile
router.patch('/update-profile', verifyToken, updateProfile);

module.exports = router;