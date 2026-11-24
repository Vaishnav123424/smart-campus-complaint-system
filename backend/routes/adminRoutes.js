/**
 * Admin Routes
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminComplaints,
  updateComplaintStatus,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/complaints', getAdminComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.get('/users', getAllUsers);

module.exports = router;
