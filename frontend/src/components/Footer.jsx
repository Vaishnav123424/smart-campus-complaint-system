import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-auto" style={{ backgroundColor: '#070d19', color: '#94a3b8' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Column 1: MITAOE Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  borderRadius: '8px',
                }}
              >
                <i className="bi bi-shield-check fs-5"></i>
              </div>
              <div>
                <span className="fw-bold text-white fs-6">MIT Academy of Engineering</span>
                <span className="d-block small text-secondary">Autonomous Institute Affiliated to SPPU</span>
              </div>
            </div>
            <p className="small text-secondary mb-3">
              Smart Campus Complaint & Maintenance Management System. A centralized digital platform
              dedicated to maintaining world-class academic infrastructure, rapid facility resolution, and student welfare.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-dark border border-secondary text-secondary">React.js</span>
              <span className="badge bg-dark border border-secondary text-secondary">Node.js</span>
              <span className="badge bg-dark border border-secondary text-secondary">Express.js</span>
              <span className="badge bg-dark border border-secondary text-secondary">MongoDB</span>
              <span className="badge bg-dark border border-secondary text-secondary">Bootstrap 5</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none hover-white">
                  Home Portal
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-secondary text-decoration-none hover-white">
                  Sign In
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-secondary text-decoration-none hover-white">
                  Student Registration
                </Link>
              </li>
              <li className="mb-2">
                <a href="#how-it-works" className="text-secondary text-decoration-none hover-white">
                  Resolution Workflow
                </a>
              </li>
              <li className="mb-2">
                <a href="#faq" className="text-secondary text-decoration-none hover-white">
                  Student FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Maintenance Categories */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Facilities Covered</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2 text-secondary">
                <i className="bi bi-check2 text-primary me-2"></i>Smart Classrooms & Projectors
              </li>
              <li className="mb-2 text-secondary">
                <i className="bi bi-check2 text-primary me-2"></i>Engineering Labs & Computers
              </li>
              <li className="mb-2 text-secondary">
                <i className="bi bi-check2 text-primary me-2"></i>Campus High-Speed Wi-Fi
              </li>
              <li className="mb-2 text-secondary">
                <i className="bi bi-check2 text-primary me-2"></i>Water & Electrical Utilities
              </li>
              <li className="mb-2 text-secondary">
                <i className="bi bi-check2 text-primary me-2"></i>Campus Cleanliness & Hygiene
              </li>
            </ul>
          </div>

          {/* Column 4: Campus Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Campus Helpdesk</h6>
            <p className="small text-secondary mb-2">
              <i className="bi bi-geo-alt-fill text-danger me-2"></i>
              Alandi (D), Pune - 412105, Maharashtra, India
            </p>
            <p className="small text-secondary mb-2">
              <i className="bi bi-telephone-fill text-success me-2"></i>
              +91 020 3025 3500 / Ext 404
            </p>
            <p className="small text-secondary mb-3">
              <i className="bi bi-envelope-fill text-primary me-2"></i>
              facilities@mitaoe.ac.in
            </p>
            <div className="bg-dark p-2 rounded border border-secondary text-center small text-light">
              <i className="bi bi-clock-history me-1 text-warning"></i>
              Facility Desk: 8:30 AM - 6:00 PM (Mon-Sat)
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#1e293b' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary pt-2">
          <div>
            &copy; {new Date().getFullYear()} MIT Academy of Engineering (MITAOE). All Rights Reserved.
          </div>
          <div className="mt-2 mt-md-0">
            Web Technology Final Project Demonstration | Department of Computer Engineering
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
