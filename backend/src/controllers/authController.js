const prisma  = require("../config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

exports.registerRecruiter = async (req, res) => {
  try {
    // 1. Receive the plaintext password and organization from the frontend
    const { name, organization, email, password } = req.body;

    const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Hash the plaintext password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save to database using your exact schema field names
    const newRecruiter = await prisma.recruiter.create({
      data: {
        name,
        email,
        organization,               // Matches your schema
        passwordHash: hashedPassword // Matches your schema
      }
    });

    const token = jwt.sign({ id: newRecruiter.id,name: newRecruiter.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: "Account created successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to create account" });
  }
};

exports.loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await prisma.recruiter.findUnique({ where: { email } });
    if (!recruiter) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the typed password with the stored passwordHash
    const isPasswordValid = await bcrypt.compare(password, recruiter.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: recruiter.id,name: recruiter.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to log in" });
  }
};