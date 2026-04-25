const jwt = require('jsonwebtoken');

// This must match the secret you used in authController.js!
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

exports.verifyToken = (req, res, next) => {
  try {
    // 1. Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Attach the decoded user data (which contains the ID) to the request object!
    req.recruiter = decoded; 

    // 5. Move on to the actual controller function
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};