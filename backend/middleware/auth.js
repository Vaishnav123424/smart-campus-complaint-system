/**
 * Authentication & Authorization Middleware
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../config/mockStore');

// Protect routes: verify JWT Bearer token and attach authenticated user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'mitaoe_campus_complaint_jwt_secret_key_2025_secure_xyz'
    );

    if (global.useDbFallback) {
      const user = await mockStore.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.',
      error: err.message,
    });
  }
};

// Grant access to specific roles (e.g. 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
