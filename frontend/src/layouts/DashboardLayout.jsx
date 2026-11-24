import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/student/dashboard')) return 'Student Dashboard';
    if (path.includes('/student/submit')) return 'Submit New Complaint';
    if (path.includes('/student/complaints')) return 'My Complaints History';
    if (path.includes('/complaint/')) return 'Complaint Details';
    if (path.includes('/admin/dashboard')) return 'Campus Facility Overview';
    if (path.includes('/admin/complaints')) return 'Complaint Management System';
    if (path.includes('/admin/users')) return 'Student & User Directory';
    return 'Campus Portal';
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="btn btn-light d-lg-none p-2 border"
              aria-label="Toggle Navigation"
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <div>
              <h5 className="mb-0 fw-bold text-dark">{getPageTitle()}</h5>
              <small className="text-secondary d-none d-md-inline-block">
                MIT Academy of Engineering | Smart Campus Management
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Quick Action Button */}
            {!isAdmin && (
              <Link
                to="/student/submit"
                className="btn btn-primary-custom btn-sm d-none d-sm-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-lg"></i>
                <span>Report Issue</span>
              </Link>
            )}

            {/* User Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-light border-0 d-flex align-items-center gap-2 p-1 pe-2 rounded-pill shadow-sm"
                type="button"
                id="userProfileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-start d-none d-md-block pe-1">
                  <div className="fw-semibold text-dark small leading-tight">{user?.name}</div>
                  <span className="badge bg-light text-secondary border small py-0 px-1">
                    {isAdmin ? 'Facility Admin' : user?.studentId || 'Student'}
                  </span>
                </div>
                <i className="bi bi-chevron-down text-muted small"></i>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2"
                aria-labelledby="userProfileDropdown"
                style={{ borderRadius: '12px', minWidth: '220px' }}
              >
                <li className="px-3 py-2 border-bottom mb-1">
                  <div className="fw-bold text-dark">{user?.name}</div>
                  <div className="small text-muted">{user?.email}</div>
                  <div className="small text-secondary mt-1">{user?.department}</div>
                </li>
                <li>
                  <Link to="/" className="dropdown-item rounded-2 py-2">
                    <i className="bi bi-house me-2 text-primary"></i>
                    Campus Home
                  </Link>
                </li>
                {isAdmin ? (
                  <>
                    <li>
                      <Link to="/admin/dashboard" className="dropdown-item rounded-2 py-2">
                        <i className="bi bi-speedometer2 me-2 text-primary"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/complaints" className="dropdown-item rounded-2 py-2">
                        <i className="bi bi-card-checklist me-2 text-primary"></i>
                        All Complaints
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/student/dashboard" className="dropdown-item rounded-2 py-2">
                        <i className="bi bi-grid me-2 text-primary"></i>
                        Student Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/student/complaints" className="dropdown-item rounded-2 py-2">
                        <i className="bi bi-collection me-2 text-primary"></i>
                        My Complaints
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <hr className="dropdown-divider my-1" />
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="dropdown-item rounded-2 py-2 text-danger"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
