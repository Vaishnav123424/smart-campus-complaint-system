/**
 * Admin Controller
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const User = require('../models/User');
const Complaint = require('../models/Complaint');
const mockStore = require('../config/mockStore');

// @desc    Get Admin Dashboard statistics and analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin Only)
const getAdminDashboard = async (req, res, next) => {
  try {
    if (global.useDbFallback) {
      const stats = await mockStore.getDashboardStats();
      return res.status(200).json({
        success: true,
        stats,
      });
    }

    // Standard MongoDB path
    const [
      totalStudents,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      recentComplaints,
      categoryStats,
      priorityStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Rejected' }),
      Complaint.find()
        .populate('user', 'name email studentId department')
        .sort({ createdAt: -1 })
        .limit(5),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const categoryCounts = {};
    categoryStats.forEach((c) => {
      categoryCounts[c._id] = c.count;
    });

    const priorityCounts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    priorityStats.forEach((p) => {
      priorityCounts[p._id] = p.count;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        categoryCounts,
        priorityCounts,
        recentComplaints,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints for administration with full search & filters
// @route   GET /api/admin/complaints
// @access  Private (Admin Only)
const getAdminComplaints = async (req, res, next) => {
  try {
    const { category, status, priority, search, department } = req.query;

    if (global.useDbFallback) {
      let complaints = await mockStore.getAllComplaints({
        category,
        status,
        priority,
        search,
      });

      if (department) {
        complaints = complaints.filter(
          (c) => c.user && c.user.department === department
        );
      }

      return res.status(200).json({
        success: true,
        count: complaints.length,
        complaints,
      });
    }

    // Standard MongoDB path
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { assignedStaff: { $regex: search, $options: 'i' } },
      ];
    }

    let complaints = await Complaint.find(query)
      .populate('user', 'name email studentId department phone')
      .sort({ createdAt: -1 });

    if (department) {
      complaints = complaints.filter(
        (c) => c.user && c.user.department === department
      );
    }

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status, assign maintenance staff, add remarks
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin Only)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, assignedStaff } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required (Pending, In Progress, Resolved, Rejected).',
      });
    }

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (global.useDbFallback) {
      const complaint = await mockStore.findComplaintById(id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found.',
        });
      }

      const updated = await mockStore.updateComplaint(
        id,
        {
          status,
          adminRemarks: adminRemarks || complaint.adminRemarks,
          assignedStaff: assignedStaff !== undefined ? assignedStaff : complaint.assignedStaff,
        },
        req.user.name || 'Campus Administrator'
      );

      return res.status(200).json({
        success: true,
        message: `Complaint ${updated.complaintId} status updated to '${status}' successfully.`,
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

    const previousStatus = complaint.status;
    complaint.status = status;

    if (assignedStaff !== undefined) {
      complaint.assignedStaff = assignedStaff;
    }

    if (adminRemarks !== undefined && adminRemarks.trim()) {
      complaint.adminRemarks = adminRemarks.trim();
    }

    // Add entry to progress timeline
    complaint.timeline.push({
      status,
      updatedBy: req.user.name || 'Campus Administrator',
      remarks:
        adminRemarks ||
        `Status updated from ${previousStatus} to ${status}. Assigned: ${
          assignedStaff || complaint.assignedStaff
        }`,
      timestamp: new Date(),
    });

    await complaint.save();

    const populated = await Complaint.findById(complaint._id).populate(
      'user',
      'name email studentId department phone'
    );

    return res.status(200).json({
      success: true,
      message: `Complaint ${complaint.complaintId} status updated to '${status}' successfully.`,
      complaint: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registered users / students
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, department, search } = req.query;

    if (global.useDbFallback) {
      let users = await mockStore.getAllUsers();

      if (role) {
        users = users.filter((u) => u.role === role);
      }
      if (department) {
        users = users.filter((u) => u.department === department);
      }
      if (search) {
        const q = search.toLowerCase();
        users = users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.studentId.toLowerCase().includes(q)
        );
      }

      // Attach complaint count
      const usersWithCounts = users.map((u) => {
        const count = mockStore.complaints.filter(
          (c) => c.user && c.user._id.toString() === u._id.toString()
        ).length;
        return { ...u, complaintCount: count };
      });

      return res.status(200).json({
        success: true,
        count: usersWithCounts.length,
        users: usersWithCounts,
      });
    }

    // Standard MongoDB path
    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Aggregate complaints count per user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const count = await Complaint.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          complaintCount: count,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminComplaints,
  updateComplaintStatus,
  getAllUsers,
};
