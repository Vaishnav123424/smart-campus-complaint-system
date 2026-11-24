import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationToast from '../components/NotificationToast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: 'School of Computer Engineering & Technology',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const departments = [
    'School of Computer Engineering & Technology',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Design (School of Design)',
    'First Year Engineering (Applied Sciences)',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      return setError('Please enter your full name.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return setError('Please enter a valid college email address.');
    }
    if (!formData.studentId.trim()) {
      return setError('Please enter your Student ID / PRN.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match. Please verify.');
    }

    setIsLoading(true);
    setError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        studentId: formData.studentId.trim().toUpperCase(),
        department: formData.department,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone.trim(),
      });

      setToast({
        show: true,
        message: 'Registration successful! Welcome to MITAOE Smart Campus Portal.',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
          <div className="col-lg-7 col-md-9">
            <div className="card card-custom border-0 p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold mb-2 shadow-sm"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }}
                >
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Student Registration</h3>
                <p className="text-secondary small">
                  Create your MITAOE Smart Campus account to report and track complaints
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-secondary"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="form-control border-start-0"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* College Email */}
                  <div className="col-md-6">
                    <label className="form-label">
                      College Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-secondary"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0"
                        placeholder="yourname@mitaoe.ac.in"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Student ID / PRN */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Student PRN / ID <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-card-text text-secondary"></i>
                      </span>
                      <input
                        type="text"
                        name="studentId"
                        className="form-control border-start-0"
                        placeholder="e.g. PRN202401088"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Department <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-diagram-3 text-secondary"></i>
                      </span>
                      <select
                        name="department"
                        className="form-select border-start-0"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        {departments.map((dept, index) => (
                          <option key={index} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone Number (Optional) */}
                  <div className="col-12">
                    <label className="form-label">
                      Mobile Number <span className="text-muted fw-normal">(Optional for SMS alerts)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone text-secondary"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control border-start-0"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-secondary"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
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

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-shield-lock text-secondary"></i>
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Repeat your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="col-12 mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termsCheck"
                        required
                        defaultChecked
                      />
                      <label className="form-check-label small text-secondary" htmlFor="termsCheck">
                        I agree to submit genuine campus maintenance requests in accordance with MITAOE
                        facility conduct policies.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary-custom w-100 py-2 fs-6 d-flex align-items-center justify-content-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm"></span>
                          <span>Creating Student Account...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check-fill"></i>
                          <span>Complete Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-secondary small mb-0">
                  Already registered on the campus portal?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Sign in to your account &rarr;
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

export default RegisterPage;
