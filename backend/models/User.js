/**
 * User Model
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student/staff full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide college email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    studentId: {
      type: String,
      required: [true, 'Please provide Student ID / PRN / Employee ID'],
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Please select department'],
      enum: [
        'School of Computer Engineering & Technology',
        'Information Technology',
        'Electronics & Telecommunication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Design (School of Design)',
        'First Year Engineering (Applied Sciences)',
        'Campus Administration & Maintenance',
      ],
      default: 'School of Computer Engineering & Technology',
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in query projections by default
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user-entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
