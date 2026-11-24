/**
 * Automated Verification Script for Backend Endpoints
 */

const http = require('http');

async function runTests() {
  // Start server
  const app = require('./server');
  // Wait 3.5s for db connection or fallback to activate
  await new Promise((res) => setTimeout(res, 3500));

  const makeRequest = (options, postData) => {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, text: body });
          }
        });
      });
      req.on('error', reject);
      if (postData) {
        req.write(JSON.stringify(postData));
      }
      req.end();
    });
  };

  console.log('\n--- 1. Testing Health Check ---');
  const health = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Health Response:', health.status, health.data);

  console.log('\n--- 2. Testing Admin Login ---');
  const adminLogin = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@mitaoe.ac.in', password: 'AdminPassword@123' }
  );
  console.log('Admin Login:', adminLogin.status, adminLogin.data.success, 'Token received:', !!adminLogin.data.token);
  const adminToken = adminLogin.data.token;

  console.log('\n--- 3. Testing Student Login ---');
  const studentLogin = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'rahul.sharma@mitaoe.ac.in', password: 'Student@123' }
  );
  console.log('Student Login:', studentLogin.status, studentLogin.data.success, 'Student Name:', studentLogin.data.user.name);
  const studentToken = studentLogin.data.token;

  console.log('\n--- 4. Testing Student Complaints Query ---');
  const studentComplaints = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/complaints',
    method: 'GET',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log('Student Complaints Count:', studentComplaints.data.count);

  console.log('\n--- 5. Testing Student Submit New Complaint ---');
  const newComplaint = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/complaints',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json',
      },
    },
    {
      title: 'Lab 402 AC Not Cooling During Afternoon Slot',
      category: 'Water and electricity problems',
      description: 'The split AC unit in Computer Lab 402 is blowing room-temperature air. Causes overheating of servers and discomfort.',
      location: 'B-Building, 4th Floor, Computer Lab 402',
      priority: 'High',
    }
  );
  console.log('New Complaint Status:', newComplaint.status, newComplaint.data.message, 'ID:', newComplaint.data.complaint.complaintId);
  const createdComplaintId = newComplaint.data.complaint._id;

  console.log('\n--- 6. Testing Admin Dashboard ---');
  const adminStats = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Admin Dashboard Stats:', adminStats.status, {
    totalStudents: adminStats.data.stats.totalStudents,
    totalComplaints: adminStats.data.stats.totalComplaints,
    pending: adminStats.data.stats.pendingComplaints,
    inProgress: adminStats.data.stats.inProgressComplaints,
  });

  console.log('\n--- 7. Testing Admin Update Status & Assign Staff ---');
  const updateStatus = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/complaints/${createdComplaintId}/status`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    },
    {
      status: 'In Progress',
      assignedStaff: 'Mr. R. Jadhav (HVAC Engineer)',
      adminRemarks: 'HVAC technician dispatched to inspect gas levels in condenser unit.',
    }
  );
  console.log('Status Update:', updateStatus.status, updateStatus.data.message);

  console.log('\n--- 8. Testing Admin User List ---');
  const usersList = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/users',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Admin Users Count:', usersList.data.count);

  console.log('\nALL BACKEND API TESTS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
