/**
 * In-Memory Fallback Database Store
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 *
 * Provides complete data persistence in-memory when a local MongoDB instance
 * is not running, ensuring that students and examiners can immediately run and
 * test the full project without any external database prerequisites.
 * Automatically synchronizes with sample MITAOE accounts and seed data.
 */

const bcrypt = require('bcryptjs');
const { sampleUsers, sampleComplaints } = require('../utils/seedData');

class MockStore {
  constructor() {
    this.users = [];
    this.complaints = [];
    this.idCounter = 100;
    this.isInitialized = false;
  }

  generateId() {
    this.idCounter += 1;
    return `65f000000000000000000${this.idCounter}`;
  }

  async init() {
    if (this.isInitialized) return;

    // Seed users
    for (const u of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const userDoc = {
        _id: this.generateId(),
        name: u.name,
        email: u.email.toLowerCase(),
        studentId: u.studentId,
        department: u.department,
        password: hashedPassword,
        role: u.role,
        phone: u.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        matchPassword: async function (entered) {
          return await bcrypt.compare(entered, this.password);
        },
      };
      this.users.push(userDoc);
    }

    // Seed complaints
    for (const c of sampleComplaints) {
      const owner = this.users.find((u) => u.email === c.userEmail) || this.users[1];
      const complaintDoc = {
        _id: this.generateId(),
        complaintId: c.complaintId,
        user: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          studentId: owner.studentId,
          department: owner.department,
        },
        title: c.title,
        category: c.category,
        description: c.description,
        location: c.location,
        image: c.image || '',
        priority: c.priority,
        status: c.status,
        adminRemarks: c.adminRemarks,
        assignedStaff: c.assignedStaff,
        timeline: c.timeline.map((t) => ({ ...t })),
        createdAt: c.timeline[0]?.timestamp || new Date(),
        updatedAt: new Date(),
      };
      this.complaints.push(complaintDoc);
    }

    this.isInitialized = true;
    console.log(`[Local Fallback Store] Initialized with ${this.users.length} users and ${this.complaints.length} complaints.`);
  }

  // User Operations
  async findUserByEmail(email, includePassword = false) {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (includePassword) return user;
    const { password, ...safeUser } = user;
    safeUser.matchPassword = user.matchPassword;
    return safeUser;
  }

  async findUserById(id) {
    const user = this.users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getAllUsers() {
    return this.users.map((u) => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
  }

  async createUser(userData) {
    const existing = await this.findUserByEmail(userData.email);
    if (existing) {
      const err = new Error('User already exists with this college email');
      err.code = 11000;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: this.generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      studentId: userData.studentId,
      department: userData.department,
      password: hashedPassword,
      role: userData.role || 'student',
      phone: userData.phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, this.password);
      },
    };

    this.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  // Complaint Operations
  async getAllComplaints(filter = {}) {
    let result = [...this.complaints];

    if (filter.user) {
      result = result.filter(
        (c) =>
          c.user._id.toString() === filter.user.toString() ||
          c.user === filter.user.toString()
      );
    }

    if (filter.category) {
      result = result.filter((c) => c.category === filter.category);
    }

    if (filter.status) {
      result = result.filter((c) => c.status === filter.status);
    }

    if (filter.priority) {
      result = result.filter((c) => c.priority === filter.priority);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintId.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.user && c.user.name && c.user.name.toLowerCase().includes(q))
      );
    }

    // Sort descending by createdAt
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }

  async findComplaintById(id) {
    return (
      this.complaints.find(
        (c) => c._id.toString() === id.toString() || c.complaintId === id
      ) || null
    );
  }

  async createComplaint(data, user) {
    const nextNumber = this.complaints.length + 1;
    const complaintId = `CMP-2025-${String(nextNumber).padStart(3, '0')}`;

    const newComplaint = {
      _id: this.generateId(),
      complaintId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
      },
      title: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      image: data.image || '',
      priority: data.priority || 'Medium',
      status: 'Pending',
      adminRemarks: 'Complaint logged. Awaiting review by campus facility department.',
      assignedStaff: 'Unassigned',
      timeline: [
        {
          status: 'Pending',
          updatedBy: user.name,
          remarks: 'Complaint filed and submitted for administrative review.',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  async updateComplaint(id, updateData, updatedBy = 'Admin') {
    const complaint = await this.findComplaintById(id);
    if (!complaint) return null;

    const previousStatus = complaint.status;

    if (updateData.status && updateData.status !== previousStatus) {
      complaint.status = updateData.status;
      complaint.timeline.push({
        status: updateData.status,
        updatedBy,
        remarks:
          updateData.adminRemarks ||
          `Status changed from ${previousStatus} to ${updateData.status}`,
        timestamp: new Date(),
      });
    }

    if (updateData.title) complaint.title = updateData.title;
    if (updateData.category) complaint.category = updateData.category;
    if (updateData.description) complaint.description = updateData.description;
    if (updateData.location) complaint.location = updateData.location;
    if (updateData.priority) complaint.priority = updateData.priority;
    if (updateData.assignedStaff !== undefined)
      complaint.assignedStaff = updateData.assignedStaff;
    if (updateData.adminRemarks !== undefined)
      complaint.adminRemarks = updateData.adminRemarks;
    if (updateData.image !== undefined) complaint.image = updateData.image;

    complaint.updatedAt = new Date();
    return complaint;
  }

  async deleteComplaint(id) {
    const index = this.complaints.findIndex(
      (c) => c._id.toString() === id.toString() || c.complaintId === id
    );
    if (index === -1) return false;
    this.complaints.splice(index, 1);
    return true;
  }

  async getDashboardStats() {
    const totalComplaints = this.complaints.length;
    const pendingComplaints = this.complaints.filter(
      (c) => c.status === 'Pending'
    ).length;
    const inProgressComplaints = this.complaints.filter(
      (c) => c.status === 'In Progress'
    ).length;
    const resolvedComplaints = this.complaints.filter(
      (c) => c.status === 'Resolved'
    ).length;
    const rejectedComplaints = this.complaints.filter(
      (c) => c.status === 'Rejected'
    ).length;
    const totalStudents = this.users.filter((u) => u.role === 'student').length;

    // Category breakdown
    const categoryCounts = {};
    for (const c of this.complaints) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    }

    // Priority breakdown
    const priorityCounts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    for (const c of this.complaints) {
      if (priorityCounts[c.priority] !== undefined) {
        priorityCounts[c.priority] += 1;
      }
    }

    return {
      totalStudents,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      categoryCounts,
      priorityCounts,
      recentComplaints: this.complaints.slice(0, 5),
    };
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
