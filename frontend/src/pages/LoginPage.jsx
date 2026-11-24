import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationToast from '../components/NotificationToast';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Check if session expired
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      setError('Your session has expired. Please sign in again.');
    }
  }, [location]);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      return setError('Please enter both email and password.');
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await login(email.trim(), password);
      setToast({
        show: true,
        message: `Welcome back, ${data.user.name}!`,
        type: 'success',
      });

      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for evaluation and testing
  const handleQuickFill = (role) => {
    setError('');
    if (role === 'admin') {
      setActiveTab('admin');
      setEmail('admin@mitaoe.ac.in');
      setPassword('AdminPassword@123');
    } else {
      setActiveTab('student');
      setEmail('rahul.sharma@mitaoe.ac.in');
      setPassword('Student@123');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            {/* Quick Demo Fill Card */}
            <div className="alert alert-light border shadow-sm p-3 mb-4 rounded-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold small text-primary">
                  <i className="bi bi-lightning-charge-fill me-1"></i>
                  Quick Evaluation Demo Fill:
                </span>
                <span className="badge bg-primary-subtle text-primary">1-Click</span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('student')}
                  className="btn btn-outline-primary btn-sm flex-fill fw-semibold py-1"
                >
                  <i className="bi bi-person me-1"></i> Demo Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="btn btn-outline-danger btn-sm flex-fill fw-semibold py-1"
                >
                  <i className="bi bi-shield-lock me-1"></i> Demo Admin
                </button>
              </div>
            </div>

            <div className="card card-custom border-0 p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold mb-2 shadow-sm"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background:
                      activeTab === 'admin'
                        ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                        : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }}
                >
                  <i className={`bi ${activeTab === 'admin' ? 'bi-shield-lock-fill' : 'bi-person-fill'} fs-4`}></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">
                  {activeTab === 'admin' ? 'Facility Admin Portal' : 'Student Sign In'}
                </h3>
                <p className="text-secondary small">
                  MIT Academy of Engineering Campus Complaint Management
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="nav nav-pills nav-fill bg-light p-1 rounded-3 mb-4 border" role="tablist">
                <button
                  type="button"
                  className={`nav-link py-2 fw-semibold small ${
                    activeTab === 'student' ? 'active bg-white text-primary shadow-sm' : 'text-secondary'
                  }`}
                  onClick={() => {
                    setActiveTab('student');
                    setError('');
                  }}
                >
                  <i className="bi bi-mortarboard me-1"></i> Student Login
                </button>
                <button
                  type="button"
                  className={`nav-link py-2 fw-semibold small ${
                    activeTab === 'admin' ? 'active bg-danger text-white shadow-sm' : 'text-secondary'
                  }`}
                  onClick={() => {
                    setActiveTab('admin');
                    setError('');
                  }}
                >
                  <i className="bi bi-shield-check me-1"></i> Admin Login
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label">
                    College Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-secondary"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder={activeTab === 'admin' ? 'admin@mitaoe.ac.in' : 'student@mitaoe.ac.in'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label mb-0">
                      Password <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-secondary"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 border-end-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0 text-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    className={`btn ${
                      activeTab === 'admin' ? 'btn-danger' : 'btn-primary-custom'
                    } w-100 py-2 fs-6 d-flex align-items-center justify-content-center gap-2`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm"></span>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i>
                        <span>Sign In as {activeTab === 'admin' ? 'Administrator' : 'Student'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Registration Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-secondary small mb-0">
                  New student to MITAOE?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Register student account &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
