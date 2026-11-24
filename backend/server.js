/**
 * Main Express Server Entry Point
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE) - Web Technology Project
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require('./config/db');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Initialize database
connectDB();

// Core Middleware
app.use(
  cors({
    origin: '*', // Allow development frontend requests
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    project: 'Smart Campus Complaint & Maintenance Management System',
    institution: 'MIT Academy of Engineering (MITAOE)',
    status: 'Operational',
    version: '1.0.0',
    database: global.useDbFallback ? 'Local Fallback Store (In-Memory)' : 'MongoDB Connected',
    documentation: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    dbMode: global.useDbFallback ? 'fallback-in-memory' : 'mongodb-connected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(` MIT Academy of Engineering (MITAOE)`);
    console.log(` Smart Campus Complaint & Maintenance Management System`);
    console.log(` Backend Server running on: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Database: ${global.useDbFallback ? 'Local Fallback' : 'MongoDB'}`);
    console.log(`============================================================\n`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
