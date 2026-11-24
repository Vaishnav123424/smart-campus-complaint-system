/**
 * Authentication Controller
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../config/mockStore');

// Helper to generate signed JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'mitaoe_campus_complaint_jwt_secret_key_2025_secure_xyz',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register new student / user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, studentId, department, password, confirmPassword, phone } = req.body;

    // Validation
    if (!name || !email || !studentId || !department || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, studentId, department, password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if using local fallback store
    if (global.useDbFallback) {
      const existingUser = await mockStore.findUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this college email already exists. Please login.',
        });
      }

      const user = await mockStore.createUser({
        name: name.trim(),
        email: normalizedEmail,
        studentId: studentId.trim().toUpperCase(),
        department,
        password,
        phone: phone || '',
        role: 'student',
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
          role: user.role,
          phone: user.phone,
        },
      });
    }

    // Standard MongoDB path
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this college email already exists. Please login.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      studentId: studentId.trim().toUpperCase(),
      department,
      password,
      phone: phone || '',
      role: 'student',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if using local fallback store
    if (global.useDbFallback) {
      const user = await mockStore.findUserByEmail(normalizedEmail, true);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found with this email.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Incorrect password.',
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
          role: user.role,
          phone: user.phone,
        },
      });
    }

    // Standard MongoDB path
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found with this email.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (Authenticated)
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
