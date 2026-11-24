import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '8px',
            }}
          >
            <i className="bi bi-shield-check fs-5"></i>
          </div>
          <div>
            <div className="fw-bold fs-6 text-white lh-1">MITAOE</div>
            <span
              className={`badge ${isAdmin ? 'bg-danger' : 'bg-primary'} text-white fw-normal mt-1`}
              style={{ fontSize: '0.68rem', letterSpacing: '0.4px' }}
            >
              {isAdmin ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <div className="text-uppercase text-secondary small fw-bold px-3 mb-2" style={{ fontSize: '0.7rem' }}>
              Management
            </div>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-speedometer2 fs-5"></i>
              <span>Dashboard Overview</span>
            </NavLink>
            <NavLink
              to="/admin/complaints"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-card-checklist fs-5"></i>
              <span>All Complaints</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-people-fill fs-5"></i>
              <span>Student Directory</span>
            </NavLink>
          </>
        ) : (
          <>
            <div className="text-uppercase text-secondary small fw-bold px-3 mb-2" style={{ fontSize: '0.7rem' }}>
              Student Services
            </div>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-grid-fill fs-5"></i>
              <span>My Dashboard</span>
            </NavLink>
            <NavLink
              to="/student/submit"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-plus-circle-fill fs-5"></i>
              <span>Submit Complaint</span>
            </NavLink>
            <NavLink
              to="/student/complaints"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleSidebar && toggleSidebar()}
            >
              <i className="bi bi-collection-fill fs-5"></i>
              <span>My Complaints</span>
            </NavLink>
          </>
        )}

        <hr className="my-3" style={{ borderColor: '#1e293b' }} />

        <div className="text-uppercase text-secondary small fw-bold px-3 mb-2" style={{ fontSize: '0.7rem' }}>
          Quick Links
        </div>
        <Link to="/" className="sidebar-link">
          <i className="bi bi-house-door fs-5"></i>
          <span>Campus Portal Home</span>
        </Link>
      </nav>

      {/* User Footer Profile */}
      <div className="sidebar-footer">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-truncate">
              <div className="fw-semibold text-white small text-truncate">{user?.name || 'User'}</div>
              <small className="text-secondary d-block text-truncate" style={{ fontSize: '0.72rem' }}>
                {user?.studentId || user?.email}
              </small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-secondary btn-sm text-white-50 border-0 p-1 hover-light"
            title="Sign out"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
