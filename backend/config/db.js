/**
 * MongoDB Database Connection Configuration
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const mongoose = require('mongoose');
const mockStore = require('./mockStore');
const { sampleUsers, sampleComplaints } = require('../utils/seedData');

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mitaoe_smart_campus';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoURI}`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Timeout quickly if no local MongoDB daemon
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    global.useDbFallback = false;

    // Seed database if empty
    await seedMongoIfEmpty();
  } catch (error) {
    console.warn(`\n============================================================`);
    console.warn(`[Database Warning] Unable to reach MongoDB server at: ${mongoURI}`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`>>> ACTIVATING AUTOMATIC LOCAL FALLBACK DATA STORE <<<`);
    console.warn(`All full-stack REST APIs (Register, Login, Complaints, Admin)`);
    console.warn(`remain 100% operational in-memory with pre-seeded demo accounts.`);
    console.warn(`To connect to MongoDB Atlas, update MONGO_URI in backend/.env`);
    console.warn(`============================================================\n`);

    global.useDbFallback = true;
    await mockStore.init();
  }
};

/**
 * Automatically populates MongoDB with initial MITAOE demo data if empty
 */
const seedMongoIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const Complaint = require('../models/Complaint');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database Seed] Seeding initial MITAOE users into MongoDB...');
      const createdUsers = [];
      for (const u of sampleUsers) {
        // Pre-save hook will hash password
        const user = await User.create({
          name: u.name,
          email: u.email,
          studentId: u.studentId,
          department: u.department,
          password: u.password,
          role: u.role,
          phone: u.phone,
        });
        createdUsers.push(user);
      }

      console.log('[Database Seed] Seeding sample campus complaints into MongoDB...');
      for (const c of sampleComplaints) {
        const owner =
          createdUsers.find((u) => u.email === c.userEmail) || createdUsers[1];
        await Complaint.create({
          complaintId: c.complaintId,
          user: owner._id,
          title: c.title,
          category: c.category,
          description: c.description,
          location: c.location,
          image: c.image || '',
          priority: c.priority,
          status: c.status,
          adminRemarks: c.adminRemarks,
          assignedStaff: c.assignedStaff,
          timeline: c.timeline,
        });
      }
      console.log('[Database Seed] Initial MITAOE demo data populated successfully.');
    }
  } catch (err) {
    console.error('[Database Seed Error]:', err.message);
  }
};

module.exports = connectDB;
