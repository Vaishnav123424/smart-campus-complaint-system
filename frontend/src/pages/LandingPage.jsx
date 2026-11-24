import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  const categories = [
    {
      title: 'Classroom Maintenance',
      icon: 'bi-easel',
      desc: 'Benches, whiteboards, podiums, windows, and lecture hall amenities.',
      color: '#4f46e5',
    },
    {
      title: 'Laboratory Equipment',
      icon: 'bi-cpu',
      desc: 'Faulty instruments, oscilloscopes, trainer kits, and safety gear.',
      color: '#0284c7',
    },
    {
      title: 'Wi-Fi & Internet Issues',
      icon: 'bi-wifi',
      desc: 'Hostel & library network dropouts, bandwidth throttling, IP conflicts.',
      color: '#059669',
    },
    {
      title: 'Projectors & Computers',
      icon: 'bi-projector',
      desc: 'Smart screen display issues, HDMI cables, audio systems, lab PCs.',
      color: '#d97706',
    },
    {
      title: 'Washroom Cleanliness',
      icon: 'bi-droplet',
      desc: 'Sanitation, hygiene upkeep, soap dispensers, regular housekeeping.',
      color: '#7c3aed',
    },
    {
      title: 'Water & Electricity',
      icon: 'bi-lightning-charge',
      desc: 'Drinking water coolers, power outages, switchboards, AC servicing.',
      color: '#dc2626',
    },
    {
      title: 'Other Campus Facilities',
      icon: 'bi-building-gear',
      desc: 'Canteen amenities, sports complex, parking shades, reading rooms.',
      color: '#475569',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Student Submits Issue',
      desc: 'Log in with your college PRN, choose the category, provide location, upload a photo, and set the urgency.',
      icon: 'bi-file-earmark-plus',
    },
    {
      step: '02',
      title: 'Administrative Triage',
      desc: 'Campus facility management reviews the ticket, verifies urgency, and assigns specialized maintenance technicians.',
      icon: 'bi-shield-check',
    },
    {
      step: '03',
      title: 'On-Ground Action',
      desc: 'Electricians, network staff, or carpenters inspect the site, log progress remarks, and resolve the problem.',
      icon: 'bi-tools',
    },
    {
      step: '04',
      title: 'Transparent Resolution',
      desc: 'Ticket transitions to Resolved with completion timestamp and admin remarks visible on your student timeline.',
      icon: 'bi-check-circle-fill',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b1120 0%, #1e1b4b 50%, #0f172a 100%)',
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white mb-3 border border-white border-opacity-10">
                <i className="bi bi-mortarboard-fill text-warning"></i>
                <small className="fw-semibold">MIT Academy of Engineering (MITAOE), Alandi, Pune</small>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3">
                Smart Campus Complaint &amp; Maintenance Management System
              </h1>

              <p className="lead text-white-50 mb-4" style={{ maxWidth: '620px' }}>
                A modern, centralized web platform connecting students directly with MITAOE facility
                supervisors and maintenance teams. Report issues in seconds, upload photo evidence,
                and track step-by-step resolution in real time.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                {isAuthenticated ? (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                    className="btn btn-primary-custom btn-lg px-4 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-grid-fill"></i>
                    <span>Open {user?.role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary-custom btn-lg px-4 d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-person-plus-fill"></i>
                      <span>Register as Student</span>
                    </Link>
                    <Link
                      to="/login"
                      className="btn btn-outline-light btn-lg px-4 d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Portal Sign In</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Live Metric Badges */}
              <div className="row g-3 pt-3 border-top border-white border-opacity-10">
                <div className="col-sm-4">
                  <div className="fw-bold fs-3 text-warning">100%</div>
                  <div className="small text-white-50">Paperless Facility Triage</div>
                </div>
                <div className="col-sm-4">
                  <div className="fw-bold fs-3 text-info">&lt; 24 Hrs</div>
                  <div className="small text-white-50">Average Inspection Turnaround</div>
                </div>
                <div className="col-sm-4">
                  <div className="fw-bold fs-3 text-success">Real-Time</div>
                  <div className="small text-white-50">Status Timeline Tracking</div>
                </div>
              </div>
            </div>

            {/* Hero Quick Preview Card */}
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-2xl p-4 text-dark"
                style={{
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary fw-bold">PORTAL DEMO</span>
                    <span className="small text-muted">MITAOE Campus</span>
                  </div>
                  <span className="badge bg-success-subtle text-success">Live System</span>
                </div>

                <div className="p-3 rounded-3 bg-light mb-3 border">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">CMP-2025-001</span>
                    <span className="badge bg-info-subtle text-info fw-semibold">In Progress</span>
                  </div>
                  <div className="fw-semibold small text-dark mb-1">
                    Projector display flickering in B-Building Room 204
                  </div>
                  <div className="small text-muted">
                    <i className="bi bi-geo-alt me-1"></i>B-Building, 2nd Floor, Room B-204
                  </div>
                  <div className="mt-2 pt-2 border-top small text-secondary">
                    <i className="bi bi-person-check text-primary me-1"></i>
                    Assigned: <strong>Mr. Sanjay Deshmukh (AV Tech)</strong>
                  </div>
                </div>

                <div className="p-3 rounded-3 bg-light mb-4 border">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">CMP-2025-002</span>
                    <span className="badge bg-success-subtle text-success fw-semibold">Resolved</span>
                  </div>
                  <div className="fw-semibold small text-dark mb-1">
                    High-speed Wi-Fi not connecting in Central Library
                  </div>
                  <div className="small text-muted">
                    <i className="bi bi-geo-alt me-1"></i>Central Library, Reading Zone C
                  </div>
                  <div className="mt-2 pt-2 border-top small text-secondary">
                    <i className="bi bi-check2-circle text-success me-1"></i>
                    Remarks: <strong>AP-LIB-04 rebooted &amp; tested at 95 Mbps.</strong>
                  </div>
                </div>

                {/* Instant Demo Fill Guide */}
                <div className="bg-primary-subtle p-3 rounded-3 text-start small">
                  <div className="fw-bold text-primary mb-1">
                    <i className="bi bi-key-fill me-1"></i>Pre-Configured Demo Accounts:
                  </div>
                  <div className="text-secondary small">
                    <strong>Admin:</strong> admin@mitaoe.ac.in | <code>AdminPassword@123</code>
                  </div>
                  <div className="text-secondary small">
                    <strong>Student:</strong> rahul.sharma@mitaoe.ac.in | <code>Student@123</code>
                  </div>
                  <div className="mt-2">
                    <Link to="/login" className="btn btn-primary btn-sm w-100 fw-semibold">
                      One-Click Sign In Demo &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase">
              Transparent Workflow
            </span>
            <h2 className="display-6 fw-bold mt-2">How Campus Complaint Resolution Works</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Four structured stages designed to ensure rapid reporting, accountable staff dispatch,
              and full visibility for students.
            </p>
          </div>

          <div className="row g-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="card h-100 card-custom p-4 border text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }}
                  >
                    <i className={`bi ${step.icon} fs-4`}></i>
                  </div>
                  <span className="badge bg-light text-secondary border fw-bold mb-2 mx-auto">
                    STAGE {step.step}
                  </span>
                  <h5 className="fw-bold text-dark mb-2">{step.title}</h5>
                  <p className="small text-secondary mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Categories Section */}
      <section id="categories" className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-purple text-white px-3 py-2 rounded-pill fw-bold text-uppercase" style={{ backgroundColor: '#7c3aed' }}>
              Scope &amp; Coverage
            </span>
            <h2 className="display-6 fw-bold mt-2">Maintenance Categories Covered</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Students can report issues across every academic wing, engineering lab, and campus amenity.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="card h-100 card-custom p-4 border bg-white">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center text-white rounded-3 flex-shrink-0"
                      style={{ width: '46px', height: '46px', backgroundColor: cat.color }}
                    >
                      <i className={`bi ${cat.icon} fs-4`}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{cat.title}</h6>
                      <p className="small text-secondary mb-0">{cat.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="features" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase">
              Core Capabilities
            </span>
            <h2 className="display-6 fw-bold mt-2">Platform Features Built for MITAOE</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Engineered using the MERN stack with modern responsive design and secure role-based access.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-primary fs-2 mb-3">
                  <i className="bi bi-camera-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Photo Evidence Upload</h5>
                <p className="small text-secondary mb-0">
                  Attach real photos of damaged equipment, faulty wiring, or broken classroom benches
                  so technicians arrive with the correct tools.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-warning fs-2 mb-3">
                  <i className="bi bi-hourglass-split"></i>
                </div>
                <h5 className="fw-bold text-dark">Real-Time Progress Timeline</h5>
                <p className="small text-secondary mb-0">
                  Track the exact progression from Pending to In Progress to Resolved, complete with
                  administrator remarks and handler details.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-success fs-2 mb-3">
                  <i className="bi bi-person-gear"></i>
                </div>
                <h5 className="fw-bold text-dark">Staff Assignment Engine</h5>
                <p className="small text-secondary mb-0">
                  Admins can assign specific facility technicians (Electrician, Plumber, AV Technician,
                  Network Engineer) directly to each complaint.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-danger fs-2 mb-3">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Role-Based JWT Security</h5>
                <p className="small text-secondary mb-0">
                  Students only access their own tickets and private data. Only authorized campus facility
                  administrators can manage and resolve complaints.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-info fs-2 mb-3">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h5 className="fw-bold text-dark">Administrative Analytics</h5>
                <p className="small text-secondary mb-0">
                  Interactive breakdowns of complaints by category, urgency level, and resolution rate
                  to identify recurring campus infrastructure bottlenecks.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 card-custom p-4 border">
                <div className="text-secondary fs-2 mb-3">
                  <i className="bi bi-phone"></i>
                </div>
                <h5 className="fw-bold text-dark">100% Responsive UI</h5>
                <p className="small text-secondary mb-0">
                  Clean Bootstrap 5 dashboard layout optimized for smartphones, tablets, and desktop
                  screens for students on the move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase">
              Frequently Asked Questions
            </span>
            <h2 className="display-6 fw-bold mt-2">Campus Maintenance FAQs</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion border-0 shadow-sm rounded-4 overflow-hidden" id="campusFaqAccordion">
                <div className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button fw-bold text-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Who can submit complaints on this portal?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#campusFaqAccordion"
                  >
                    <div className="accordion-body text-secondary small">
                      All registered students and faculty members of MIT Academy of Engineering (MITAOE)
                      can register using their official college email ID and Student PRN to submit complaints.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed fw-bold text-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      How long does it take for a complaint to be resolved?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#campusFaqAccordion"
                  >
                    <div className="accordion-body text-secondary small">
                      Urgent issues such as power outages or water pipe leakage are triaged immediately
                      within 2 to 4 hours. General classroom and lab maintenance tickets are resolved
                      within 24 to 48 hours depending on hardware procurement.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed fw-bold text-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Can I edit or cancel my complaint after submitting?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#campusFaqAccordion"
                  >
                    <div className="accordion-body text-secondary small">
                      Yes! As long as the complaint status remains in <strong>Pending</strong> state, you can
                      update the title, description, location, or delete the complaint entirely from your
                      "My Complaints" page.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed fw-bold text-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      How do I test this application for project evaluation?
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#campusFaqAccordion"
                  >
                    <div className="accordion-body text-secondary small">
                      Click "Sign In" on the top navigation bar. On the login page, you will find one-click
                      quick login buttons for both <strong>Demo Student (Rahul Sharma)</strong> and{' '}
                      <strong>Demo Admin (Facility Manager)</strong> to immediately test all roles and features!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section
        className="py-5 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0b1120 100%)' }}
      >
        <div className="container py-4">
          <h2 className="fw-bold mb-3">Facing an Infrastructure or Facility Issue on Campus?</h2>
          <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            Report it instantly. Help us keep MITAOE campus clean, well-equipped, and technologically advanced.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-primary-custom btn-lg px-4">
              Get Started Now
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              Sign In to Track
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
