/**
 * Complaint Controller
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const Complaint = require('../models/Complaint');
const mockStore = require('../config/mockStore');

// Helper to generate next Complaint ID format CMP-YYYY-XXX
const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  let count = 0;
  if (global.useDbFallback) {
    count = mockStore.complaints.length;
  } else {
    count = await Complaint.countDocuments();
  }
  const nextNumber = count + 1;
  return `CMP-${year}-${String(nextNumber).padStart(3, '0')}`;
};

// @desc    Submit new complaint
// @route   POST /api/complaints
// @access  Private (Student & Admin)
const createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and campus location.',
      });
    }

    // Handle image from file upload or JSON payload
    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    if (global.useDbFallback) {
      const newComplaint = await mockStore.createComplaint(
        {
          title: title.trim(),
          category,
          description: description.trim(),
          location: location.trim(),
          priority: priority || 'Medium',
          image,
        },
        req.user
      );

      return res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully!',
        complaint: newComplaint,
      });
    }

    // Standard MongoDB path
    const complaintId = await generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      user: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      priority: priority || 'Medium',
      image,
      status: 'Pending',
      adminRemarks: 'Complaint logged. Awaiting review by campus facility department.',
      assignedStaff: 'Unassigned',
      timeline: [
        {
          status: 'Pending',
          updatedBy: req.user.name,
          remarks: 'Complaint filed and submitted for administrative review.',
          timestamp: new Date(),
        },
      ],
    });

    const populated = await Complaint.findById(complaint._id).populate(
      'user',
      'name email studentId department phone'
    );

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints (Students see only their complaints; Admins see all)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, search } = req.query;

    if (global.useDbFallback) {
      const filter = {};
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (search) filter.search = search;

      const complaints = await mockStore.getAllComplaints(filter);
      return res.status(200).json({
        success: true,
        count: complaints.length,
        complaints,
      });
    }

    // Standard MongoDB path
    const query = {};

    // Role-based scoping
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email studentId department')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.useDbFallback) {
      const complaint = await mockStore.findComplaintById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found with the requested ID.',
        });
      }

      // Security check: Student can only view their own complaint
      if (
        req.user.role !== 'admin' &&
        complaint.user._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own complaints.',
        });
      }

      return res.status(200).json({
        success: true,
        complaint,
      });
    }

    // Standard MongoDB path
    let complaint;
    if (id.startsWith('CMP-')) {
      complaint = await Complaint.findOne({ complaintId: id }).populate(
        'user',
        'name email studentId department phone'
      );
    } else {
      complaint = await Complaint.findById(id).populate(
        'user',
        'name email studentId department phone'
      );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found with the requested ID.',
      });
    }

    // Security check
    if (
      req.user.role !== 'admin' &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own complaints.',
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint details (Students can edit while pending; Admins can edit any)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.useDbFallback) {
      const existing = await mockStore.findComplaintById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found.',
        });
      }

      // If student, check ownership and pending state
      if (req.user.role !== 'admin') {
        if (existing.user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to edit this complaint.',
          });
        }
        if (existing.status !== 'Pending') {
          return res.status(400).json({
            success: false,
            message: 'Complaints that are In Progress or Resolved cannot be modified by students.',
          });
        }
      }

      let imageUpdate = undefined;
      if (req.file) {
        imageUpdate = `/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        imageUpdate = req.body.image;
      }

      const updateData = {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        location: req.body.location,
        priority: req.body.priority,
        image: imageUpdate,
      };

      if (req.user.role === 'admin') {
        if (req.body.status) updateData.status = req.body.status;
        if (req.body.adminRemarks) updateData.adminRemarks = req.body.adminRemarks;
        if (req.body.assignedStaff) updateData.assignedStaff = req.body.assignedStaff;
      }

      const updated = await mockStore.updateComplaint(id, updateData, req.user.name);

      return res.status(200).json({
        success: true,
        message: 'Complaint updated successfully.',
        complaint: updated,
      });
    }

    // Standard MongoDB path
    let complaint = await Complaint.findById(id);
    if (!complaint && id.startsWith('CMP-')) {
      complaint = await Complaint.findOne({ complaintId: id });
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Security check
    if (req.user.role !== 'admin') {
      if (complaint.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to edit this complaint.',
        });
      }
      if (complaint.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Complaints that are In Progress or Resolved cannot be modified by students.',
        });
      }
    }

    if (req.body.title) complaint.title = req.body.title.trim();
    if (req.body.category) complaint.category = req.body.category;
    if (req.body.description) complaint.description = req.body.description.trim();
    if (req.body.location) complaint.location = req.body.location.trim();
    if (req.body.priority) complaint.priority = req.body.priority;

    if (req.file) {
      complaint.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      complaint.image = req.body.image;
    }

    // Admin fields
    if (req.user.role === 'admin') {
      if (req.body.assignedStaff !== undefined) {
        complaint.assignedStaff = req.body.assignedStaff;
      }
      if (req.body.adminRemarks !== undefined) {
        complaint.adminRemarks = req.body.adminRemarks;
      }
      if (req.body.status && req.body.status !== complaint.status) {
        const oldStatus = complaint.status;
        complaint.status = req.body.status;
        complaint.timeline.push({
          status: req.body.status,
          updatedBy: req.user.name,
          remarks:
            req.body.adminRemarks ||
            `Status transitioned from ${oldStatus} to ${req.body.status}`,
          timestamp: new Date(),
        });
      }
    }

    await complaint.save();

    const populated = await Complaint.findById(complaint._id).populate(
      'user',
      'name email studentId department phone'
    );

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Student can delete own pending; Admin can delete any)
const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (global.useDbFallback) {
      const complaint = await mockStore.findComplaintById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found.',
        });
      }

      if (req.user.role !== 'admin') {
        if (complaint.user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to delete this complaint.',
          });
        }
        if (complaint.status !== 'Pending') {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete a complaint that is already In Progress or Resolved.',
          });
        }
      }

      await mockStore.deleteComplaint(id);

      return res.status(200).json({
        success: true,
        message: 'Complaint deleted successfully.',
      });
    }

    // Standard MongoDB path
    let complaint = await Complaint.findById(id);
    if (!complaint && id.startsWith('CMP-')) {
      complaint = await Complaint.findOne({ complaintId: id });
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (req.user.role !== 'admin') {
      if (complaint.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this complaint.',
        });
      }
      if (complaint.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete a complaint that is already In Progress or Resolved.',
        });
      }
    }

    await Complaint.findByIdAndDelete(complaint._id);

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
