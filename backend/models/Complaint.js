/**
 * Complaint Model
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'System Administrator',
    },
    remarks: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a complaint title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      enum: [
        'Classroom maintenance',
        'Laboratory equipment',
        'Wi-Fi and internet issues',
        'Projectors and computers',
        'Washroom cleanliness',
        'Water and electricity problems',
        'Other campus facilities',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed complaint description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please specify campus location (e.g. B-Building, 3rd Floor, Lab 304)'],
      trim: true,
    },
    image: {
      type: String,
      default: '', // Relative URL or placeholder
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      default: 'Complaint logged. Awaiting review by campus facility department.',
    },
    assignedStaff: {
      type: String,
      default: 'Unassigned',
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure the initial timeline entry is added
complaintSchema.pre('save', function (next) {
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = [
      {
        status: this.status,
        updatedBy: 'Student Submitter',
        remarks: 'Complaint filed and submitted for administrative review.',
        timestamp: new Date(),
      },
    ];
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
