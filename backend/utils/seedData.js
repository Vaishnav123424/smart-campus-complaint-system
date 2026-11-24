/**
 * Initial Seed Data for MITAOE Campus Complaint & Maintenance Management System
 */

const sampleUsers = [
  {
    name: 'Admin Facility Manager',
    email: 'admin@mitaoe.ac.in',
    studentId: 'FACULTY-ADM-01',
    department: 'Campus Administration & Maintenance',
    password: 'AdminPassword@123',
    role: 'admin',
    phone: '+91 98765 43210',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@mitaoe.ac.in',
    studentId: 'PRN202301045',
    department: 'School of Computer Engineering & Technology',
    password: 'Student@123',
    role: 'student',
    phone: '+91 91234 56780',
  },
  {
    name: 'Sneha Patil',
    email: 'sneha.patil@mitaoe.ac.in',
    studentId: 'PRN202302088',
    department: 'Information Technology',
    password: 'Student@123',
    role: 'student',
    phone: '+91 92345 67891',
  },
];

const sampleComplaints = [
  {
    complaintId: 'CMP-2025-001',
    userEmail: 'rahul.sharma@mitaoe.ac.in',
    title: 'Projector display flickering in B-Building Room 204',
    category: 'Projectors and computers',
    description:
      'The ceiling-mounted Epson projector in Room 204 has severe screen flickering and turns off automatically every 10 minutes during Web Technology lectures. Needs urgent replacement of HDMI cable or lamp inspection.',
    location: 'B-Building, 2nd Floor, Room B-204 (Smart Classroom)',
    image: '',
    priority: 'High',
    status: 'In Progress',
    adminRemarks:
      'AV Technician Mr. Sanjay Deshmukh has inspected the unit. Replacement HDMI splitter and power supply cord requested from Central Stores.',
    assignedStaff: 'Mr. Sanjay Deshmukh (AV Technician)',
    timeline: [
      {
        status: 'Pending',
        updatedBy: 'Rahul Sharma',
        remarks: 'Complaint lodged by student via portal.',
        timestamp: new Date(Date.now() - 3 * 86400000),
      },
      {
        status: 'In Progress',
        updatedBy: 'Admin Facility Manager',
        remarks: 'Assigned to Mr. Sanjay Deshmukh. Inspection scheduled.',
        timestamp: new Date(Date.now() - 1 * 86400000),
      },
    ],
  },
  {
    complaintId: 'CMP-2025-002',
    userEmail: 'sneha.patil@mitaoe.ac.in',
    title: 'High-speed Wi-Fi not connecting in Central Library Study Hall',
    category: 'Wi-Fi and internet issues',
    description:
      'The MITAOE-Student Wi-Fi network frequently drops connections and shows IP configuration failure in the Reading Zone of the Central Library. Students unable to access digital journals and research portals.',
    location: 'Central Library, 1st Floor, Silent Reading Zone C',
    image: '',
    priority: 'Medium',
    status: 'Resolved',
    adminRemarks:
      'Network Team inspected Access Point AP-LIB-04. Firmware updated, DHCP pool expanded, and signal verified at 95 Mbps.',
    assignedStaff: 'Network Team (Mr. Pradeep Joshi)',
    timeline: [
      {
        status: 'Pending',
        updatedBy: 'Sneha Patil',
        remarks: 'Wi-Fi connectivity issue submitted.',
        timestamp: new Date(Date.now() - 5 * 86400000),
      },
      {
        status: 'In Progress',
        updatedBy: 'Admin Facility Manager',
        remarks: 'Forwarded to IT infrastructure team for router diagnostics.',
        timestamp: new Date(Date.now() - 4 * 86400000),
      },
      {
        status: 'Resolved',
        updatedBy: 'Admin Facility Manager',
        remarks: 'AP-LIB-04 rebooted and DHCP lease renewed. Connectivity confirmed.',
        timestamp: new Date(Date.now() - 2 * 86400000),
      },
    ],
  },
  {
    complaintId: 'CMP-2025-003',
    userEmail: 'rahul.sharma@mitaoe.ac.in',
    title: 'Continuous water tap leakage in 3rd Floor Washroom (A-Wing)',
    category: 'Water and electricity problems',
    description:
      'Water tap in the washbasin on the 3rd floor west wing is leaking heavily, causing water wastage and slippery wet floor near the entrance.',
    location: 'A-Building, 3rd Floor, West Wing Boys Restroom',
    image: '',
    priority: 'Urgent',
    status: 'Pending',
    adminRemarks: 'Complaint logged. Facility supervisor alerted for immediate plumbing inspection.',
    assignedStaff: 'Unassigned',
    timeline: [
      {
        status: 'Pending',
        updatedBy: 'Rahul Sharma',
        remarks: 'Urgent water leakage reported.',
        timestamp: new Date(Date.now() - 4 * 3600000),
      },
    ],
  },
  {
    complaintId: 'CMP-2025-004',
    userEmail: 'sneha.patil@mitaoe.ac.in',
    title: 'Digital Storage Oscilloscope faulty in IoT Lab',
    category: 'Laboratory equipment',
    description:
      'Workstation #7 DSO shows erratic waveform voltage readouts and Channel 2 input port appears physically loose. Crucial for upcoming practical exam demonstrations.',
    location: 'D-Building, Ground Floor, IoT & Embedded Systems Lab 012',
    image: '',
    priority: 'High',
    status: 'In Progress',
    adminRemarks:
      'Equipment sent to Department Instrumentation Lab for probe recalibration. Expected back within 48 hours.',
    assignedStaff: 'Lab Incharge (Prof. S. Kulkarni)',
    timeline: [
      {
        status: 'Pending',
        updatedBy: 'Sneha Patil',
        remarks: 'Lab equipment problem reported.',
        timestamp: new Date(Date.now() - 2 * 86400000),
      },
      {
        status: 'In Progress',
        updatedBy: 'Admin Facility Manager',
        remarks: 'Sent to instrumentation lab for testing.',
        timestamp: new Date(Date.now() - 1 * 86400000),
      },
    ],
  },
  {
    complaintId: 'CMP-2025-005',
    userEmail: 'rahul.sharma@mitaoe.ac.in',
    title: 'Broken bench armrest in Lecture Hall L-102',
    category: 'Classroom maintenance',
    description:
      'Second row left side wooden bench armrest is cracked and has sharp edges, creating safety hazard for students during lectures.',
    location: 'Main Academic Block, Lecture Hall L-102',
    image: '',
    priority: 'Low',
    status: 'Resolved',
    adminRemarks: 'Carpentry staff repaired the wooden armrest and repainted the surface.',
    assignedStaff: 'Carpentry Maintenance Cell',
    timeline: [
      {
        status: 'Pending',
        updatedBy: 'Rahul Sharma',
        remarks: 'Classroom bench repair requested.',
        timestamp: new Date(Date.now() - 7 * 86400000),
      },
      {
        status: 'In Progress',
        updatedBy: 'Admin Facility Manager',
        remarks: 'Assigned to carpentry workshop.',
        timestamp: new Date(Date.now() - 6 * 86400000),
      },
      {
        status: 'Resolved',
        updatedBy: 'Admin Facility Manager',
        remarks: 'Bench repaired, sanded, and tested.',
        timestamp: new Date(Date.now() - 5 * 86400000),
      },
    ],
  },
];

module.exports = { sampleUsers, sampleComplaints };
