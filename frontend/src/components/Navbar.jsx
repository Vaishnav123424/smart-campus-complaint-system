import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#0b1120' }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '10px',
            }}
          >
            <i className="bi bi-shield-check fs-4"></i>
          </div>
          <div>
            <div className="fw-bold fs-5 text-white lh-1">MITAOE</div>
            <small className="text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              SMART CAMPUS PORTAL
            </small>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white-50 px-3">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a href="#how-it-works" className="nav-link text-white-50 px-3">
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a href="#features" className="nav-link text-white-50 px-3">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a href="#categories" className="nav-link text-white-50 px-3">
                Categories
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                >
                  <i className="bi bi-grid-fill"></i>
                  <span>Go to {user?.role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="btn btn-outline-light btn-sm px-3"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light px-3 py-2 fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-custom px-4 py-2">
                  Student Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
