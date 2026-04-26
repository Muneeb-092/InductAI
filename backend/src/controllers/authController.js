const prisma  = require("../config/db");
const bcrypt = require('bcryptjs');
const sendEmail = require("../services/sendEmail");
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
exports.updateProfile = async (req, res) => {
  try {
    const { name, organization } = req.body;
    const recruiterId = req.recruiter.id;

    const updatedRecruiter = await prisma.recruiter.update({
      where: { id: recruiterId },
      data: { name, organization }
    });

    // Generate a NEW token so the Header reflects the new name immediately
    const token = jwt.sign(
      { 
        id: updatedRecruiter.id, 
        name: updatedRecruiter.name, 
        email: updatedRecruiter.email,
        organization: updatedRecruiter.organization 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const recruiter = await prisma.recruiter.findUnique({ where: { email } });

    if (!recruiter) {
      return res.status(200).json({ 
        success: true, 
        message: "If an account exists, a reset link has been sent." 
      });
    }

    // For now, we'll send a "Dummy" link. 
    // Later we will generate a real secure token.
    const resetUrl = `http://localhost:5173/reset-password?user=${recruiter.id}`;

    const message = `You requested a password reset. Please click the link below to reset your password: \n\n ${resetUrl}`;

    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Password Reset Request</h2>
        <p>Hi ${recruiter.name},</p>
        <p>Click the button below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" style="background: #0052CC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: recruiter.email,
      subject: "InductAI - Password Reset Request",
      message,
      html
    });

    res.status(200).json({ success: true, message: "Email sent!" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Email could not be sent" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    // 1. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Update the database
    await prisma.recruiter.update({
      where: { id: parseInt(userId) },
      data: { passwordHash: hashedPassword }
    });

    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};