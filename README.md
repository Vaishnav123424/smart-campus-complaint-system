# Smart Campus Complaint & Maintenance Management System

### MIT Academy of Engineering (MITAOE), Alandi (D), Pune
**Department of Computer Engineering & Information Technology**  
*Course: Web Technology Laboratory Project*

---

## 1. Project Overview

The **Smart Campus Complaint & Maintenance Management System** is a centralized, full-stack web application engineered to streamline the reporting, tracking, and resolution of campus infrastructure issues at MIT Academy of Engineering (MITAOE).

The platform replaces slow, manual paper registers with an automated, role-based digital workflow. Students can report issues regarding classrooms, laboratories, campus Wi-Fi, projectors, washrooms, and electrical utilities with photo evidence. Campus facility administrators can triage tickets, assign maintenance technicians, log remarks, and track resolution timelines with complete transparency.

---

## 2. Technology Stack (Mandatory & Strictly Adhered)

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), React.js (Vite) | Modern responsive single-page application with Navy Blue (`#0f172a`) & Purple (`#6366f1`) design system, Bootstrap Icons & Lucide React. |
| **Backend** | Node.js, Express.js | Modular RESTful API server with controllers, middleware, JWT authentication, and file upload support. |
| **Database** | MongoDB & Mongoose | Document-oriented database with schema validation, ObjectIds, population, and dual-mode resilience. |
| **API & Tools** | RESTful API, JSON, Postman | Standardized JSON request/response formats with complete Postman test collection. |

> **Note:** Strictly built without Python, PHP, Django, Firebase, or Supabase. 100% pure MERN stack.

---

## 3. Key Functional Features

### A. Student Features
- **Student Registration & Login:** Official college email (`@mitaoe.ac.in`), Student PRN, department, and secure hashed password.
- **Student Dashboard:** Real-time metrics of submitted complaints (Total, Pending, In Progress, Resolved) and resolution rate.
- **Complaint Submission Form:** Title, category selector with icons, detailed description, location picker with quick-fill presets, priority urgency levels (Low, Medium, High, Urgent), and photo evidence upload.
- **My Complaints Hub:** Instant live search, multi-category filters, status filters, sorting, and view details.
- **Complaint Details & Live Timeline:** Step-by-step chronological tracking (`Pending` &rarr; `In Progress` &rarr; `Resolved`), technician assignment badges, admin remarks, and fullscreen image lightbox.
- **Ticket Editing & Cancellation:** Students can edit or delete their complaints while in `Pending` state.

### B. Administrator Features
- **Admin Authentication:** Protected administrative routes verified with role-based JWT tokens.
- **Facility Analytics Dashboard:** Real-time counts of registered students, total complaints, pending triage, in-progress work, and resolved issues, with interactive category and urgency breakdown bars.
- **Complaint Management Console:** Filter, search, and manage all campus complaints across all departments.
- **Triage & Status Updater Modal:** Update ticket status (`Pending`, `In Progress`, `Resolved`, `Rejected`), assign specialized maintenance staff (e.g., Electrician, AV Technician, Plumber, Network Team), and add official remarks.
- **Content Moderation:** Delete inappropriate or spam complaints with confirmation dialogs.
- **User Directory:** Browse registered students, view academic departments, PRNs, contact numbers, and complaint frequencies.

---

## 4. Project Folder Structure

```text
smart-campus-complaint-system/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection & auto-seeding logic
│   │   └── mockStore.js          # In-memory dual-mode store for zero-friction evaluation
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── complaintController.js# Complaint CRUD & filtering
│   │   └── adminController.js    # Admin analytics, triage & user directory
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   ├── error.js              # Central error handling & 404 handler
│   │   └── upload.js             # Multer image upload configuration
│   ├── models/
│   │   ├── User.js               # Mongoose schema for students & admins
│   │   └── Complaint.js          # Mongoose schema for complaints & timelines
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── complaintRoutes.js    # /api/complaints routes
│   │   └── adminRoutes.js        # /api/admin routes
│   ├── uploads/                  # Uploaded photo evidence storage
│   ├── utils/
│   │   └── seedData.js           # Sample MITAOE users & campus tickets
│   ├── test-api.js               # Automated test suite for backend endpoints
│   ├── server.js                 # Main Express server entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML5 shell with Bootstrap 5 & fonts
│   ├── src/
│   │   ├── assets/               # Brand logos & icons
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Landing page navigation
│   │   │   ├── Sidebar.jsx       # Dashboard sidebar with active indicators
│   │   │   ├── Footer.jsx        # MITAOE campus footer
│   │   │   ├── StatCard.jsx      # Animated metric cards
│   │   │   ├── StatusBadge.jsx   # Color-coded status pills
│   │   │   ├── PriorityBadge.jsx # Urgency priority indicators
│   │   │   ├── CategoryBadge.jsx # Facility category badges with icons
│   │   │   ├── StatusTimeline.jsx# Step-by-step progress tracking
│   │   │   ├── LoadingSpinner.jsx# Clean loading spinner
│   │   │   ├── ConfirmationModal.jsx # Reusable Bootstrap modal
│   │   │   ├── NotificationToast.jsx # Auto-dismissing alerts
│   │   │   └── ProtectedRoute.jsx# Role-based route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state, JWT, login, logout
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx    # Public layout wrapper
│   │   │   └── DashboardLayout.jsx # Authenticated sidebar layout
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, how it works, categories, FAQs
│   │   │   ├── LoginPage.jsx     # Student/Admin login with 1-click demo fill
│   │   │   ├── RegisterPage.jsx  # Student signup with PRN and department
│   │   │   ├── StudentDashboard.jsx # Student metrics & recent activity
│   │   │   ├── SubmitComplaintPage.jsx # Complaint submission form & image upload
│   │   │   ├── MyComplaintsPage.jsx # Student complaints with search & filters
│   │   │   ├── ComplaintDetailsPage.jsx # Full ticket details, timeline & image zoom
│   │   │   ├── AdminDashboard.jsx # Administrative analytics & charts
│   │   │   ├── AdminComplaintsPage.jsx # Triage, assign staff & update status
│   │   │   ├── AdminUsersPage.jsx# Student & user directory
│   │   │   └── NotFoundPage.jsx  # 404 handler
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT request interceptor
│   │   │   ├── complaintService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx               # React Router v6 definitions
│   │   ├── index.css             # Custom design system & styles
│   │   └── main.jsx              # React DOM render root
│   ├── package.json
│   └── vite.config.js
├── postman/
│   └── Smart_Campus_MITAOE_API.postman_collection.json # Ready-to-import collection
├── package.json                  # Root runner script
└── README.md                     # Comprehensive documentation
```

---

## 5. Database Schema Design (MongoDB)

### `Users` Collection
```javascript
{
  _id: ObjectId("..."),
  name: "Rahul Sharma",
  email: "rahul.sharma@mitaoe.ac.in", // Unique, lowercase, indexed
  studentId: "PRN202301045",          // Student PRN or Staff ID
  department: "School of Computer Engineering & Technology",
  password: "$2a$10$...",             // Hashed with bcrypt (salt = 10)
  role: "student",                    // 'student' or 'admin'
  phone: "+91 91234 56780",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### `Complaints` Collection
```javascript
{
  _id: ObjectId("..."),
  complaintId: "CMP-2025-001",       // Unique human-readable ticket ID
  user: ObjectId("..."),             // References Users._id (Populated)
  title: "Projector display flickering in B-Building Room 204",
  category: "Projectors and computers",
  description: "Ceiling projector keeps flickering and shuts down during lectures...",
  location: "B-Building, 2nd Floor, Room B-204",
  image: "/uploads/complaint-1711200000.jpg",
  priority: "High",                  // 'Low' | 'Medium' | 'High' | 'Urgent'
  status: "In Progress",             // 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
  adminRemarks: "Replacement HDMI splitter requested from Central Stores.",
  assignedStaff: "Mr. Sanjay Deshmukh (AV Technician)",
  timeline: [
    {
      status: "Pending",
      updatedBy: "Rahul Sharma",
      remarks: "Complaint lodged via student portal.",
      timestamp: ISODate("...")
    },
    {
      status: "In Progress",
      updatedBy: "Admin Facility Manager",
      remarks: "Assigned to Mr. Sanjay Deshmukh. Inspection scheduled.",
      timestamp: ISODate("...")
    }
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 6. REST API Documentation

### A. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student with name, email, PRN, department, password. |
| `POST` | `/api/auth/login` | Public | Authenticate user with email and password; returns JWT token. |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile from JWT token. |

### B. Complaint Endpoints (`/api/complaints`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/complaints` | Private | Submit new complaint with title, category, description, location, priority, and optional image. |
| `GET` | `/api/complaints` | Private | Get complaints (Students see only their own; Admins see all). Supports query filters: `?category=&status=&priority=&search=`. |
| `GET` | `/api/complaints/:id` | Private | Retrieve full details of single complaint (ID or `CMP-XXXX-XXX`). |
| `PUT` | `/api/complaints/:id` | Private | Update complaint (Students can edit if Pending; Admins can edit any). |
| `DELETE`| `/api/complaints/:id` | Private | Delete complaint (Students can delete if Pending; Admins can delete any). |

### C. Admin Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin Only | Get aggregated metrics (total students, total complaints, status counts, category breakdown, recent tickets). |
| `GET` | `/api/admin/complaints` | Admin Only | Retrieve all complaints with multi-criteria search and filters. |
| `PUT` | `/api/admin/complaints/:id/status` | Admin Only | Update ticket status (`Pending`, `In Progress`, `Resolved`, `Rejected`), assign staff, and add remarks to timeline. |
| `GET` | `/api/admin/users` | Admin Only | Retrieve all registered students and staff with complaint counts. |

---

## 7. Pre-Configured Demo Credentials

For quick evaluation and grading demonstrations, the application comes with built-in test accounts:

| Role | Email | Password | PRN / ID | Description |
|---|---|---|---|---|
| **Facility Administrator** | `admin@mitaoe.ac.in` | `AdminPassword@123` | `FACULTY-ADM-01` | Full administrative control, triage, staff assignment, analytics. |
| **Student (Rahul)** | `rahul.sharma@mitaoe.ac.in` | `Student@123` | `PRN202301045` | Student in School of Computer Engineering with active tickets. |
| **Student (Sneha)** | `sneha.patil@mitaoe.ac.in` | `Student@123` | `PRN202302088` | Student in Information Technology with resolved Wi-Fi complaint. |

> **Pro Tip:** On the Login page (`/login`), click the **"Demo Student"** or **"Demo Admin"** button to auto-fill credentials with one click!

---

## 8. Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- Optional: **MongoDB** (v6.0+ local server or MongoDB Atlas cloud account)

### Step 1: Clone or Navigate to Project
```bash
cd smart-campus-complaint-system
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env` (already created with sensible defaults):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mitaoe_smart_campus
JWT_SECRET=mitaoe_campus_complaint_jwt_secret_key_2025_secure_xyz
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Run automated backend API tests to verify endpoints:
```bash
npm test
```

Start the backend server:
```bash
npm start
# Output: Backend Server running on: http://localhost:5000
```

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Output: Local: http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 9. MongoDB Database Setup Guide

The application supports both **local MongoDB** and **MongoDB Atlas (Cloud)**:

### Option A: Local MongoDB
1. Ensure the MongoDB service is running:
   ```bash
   mongod --dbpath <data-path>
   ```
2. The backend connects automatically to `mongodb://127.0.0.1:27017/mitaoe_smart_campus`.
3. If empty, the system automatically runs the database seeder on first launch.

### Option B: MongoDB Atlas (Cloud)
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a database user (e.g., `mitaoe_admin` and strong password).
4. Click **Connect &rarr; Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://mitaoe_admin:<password>@cluster0.abcde.mongodb.net/mitaoe_smart_campus?retryWrites=true&w=majority
   ```
5. Paste this connection string as `MONGO_URI` in `backend/.env`.

> **Zero-Friction Fallback:** If MongoDB is not running on your local machine, the application activates an in-memory dual-mode database with identical schema behavior and pre-seeded demo accounts, allowing immediate testing without prerequisites!

---

## 10. Postman API Testing Instructions

A complete, ready-to-import Postman Collection is located at:
`postman/Smart_Campus_MITAOE_API.postman_collection.json`

### Steps to Test in Postman:
1. Open Postman and click **Import**.
2. Select `postman/Smart_Campus_MITAOE_API.postman_collection.json`.
3. The collection includes 4 folders:
   - **1. Authentication:** Register Student, Login as Student, Login as Admin, Get Profile.
   - **2. Complaints:** Submit Complaint, Get Complaints, Filter by Status/Category, Get by ID, Update, Delete.
   - **3. Admin Management:** Admin Dashboard Analytics, Admin Complaints List, Update Status & Staff, All Users Directory.
   - **4. System Health Check:** `GET /api/health`.
4. Run the requests in sequence. Use the token returned from Login in the `Authorization: Bearer <token>` header of subsequent requests.

---

## 11. Production Deployment Guide

### A. Deploy Backend to Render (Free Web Service)
1. Push your repository to GitHub.
2. Sign in to [render.com](https://render.com) and click **New &rarr; Web Service**.
3. Select your repository and configure:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mitaoe_smart_campus?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_random_secure_jwt_secret_key`
   - `JWT_EXPIRE`: `30d`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
5. Click **Deploy Web Service** and note your public backend URL (e.g., `https://mitaoe-complaint-api.onrender.com`).

### B. Deploy Frontend to Vercel
1. Sign in to [vercel.com](https://vercel.com) and click **Add New &rarr; Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://mitaoe-complaint-api.onrender.com/api` (your deployed Render backend URL)
5. Click **Deploy**. Your application will be live globally with SSL!

---

## 12. Project Demonstration & Viva Checklist

When presenting this project for evaluation:
1. **Landing Page:** Show MITAOE branding, how the 4-step workflow works, and maintenance categories covered.
2. **Student Workflow:**
   - Log in using `rahul.sharma@mitaoe.ac.in` (or use the one-click demo button).
   - View Student Dashboard with 4 live animated statistics cards.
   - Submit a new complaint with photo upload, location pick, and urgency selection.
   - View "My Complaints" page and demonstrate real-time search and category filtering.
   - Open Complaint Details page to demonstrate the step-by-step progress timeline.
3. **Admin Workflow:**
   - Sign in as Admin (`admin@mitaoe.ac.in`).
   - Demonstrate the Admin Dashboard with category distribution bars and urgency analytics.
   - Open Complaint Management, filter by pending complaints, click **Triage**.
   - Change status to `In Progress`, assign maintenance technician (`Mr. Sanjay Deshmukh`), and enter administrative remarks.
   - Switch back to the student view to show the live updated status and timeline remark!
4. **Code Quality:**
   - Explain Mongoose schemas in `backend/models/`.
   - Explain bcrypt password hashing and JWT token verification in `backend/middleware/auth.js`.
   - Explain Axios interceptors in `frontend/src/services/api.js`.

---

## 13. License & Authors

Developed for **MIT Academy of Engineering (MITAOE)**  
Web Technology Laboratory Demonstration  
Autonomous Institute Affiliated to Savitribai Phule Pune University (SPPU)  
© 2025 MITAOE. All Rights Reserved.
