/**
 * Complaint Routes
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Base route: /api/complaints
router
  .route('/')
  .post(protect, upload.single('image'), createComplaint)
  .get(protect, getComplaints);

router
  .route('/:id')
  .get(protect, getComplaintById)
  .put(protect, upload.single('image'), updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
