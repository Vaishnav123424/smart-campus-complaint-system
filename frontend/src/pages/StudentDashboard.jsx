import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentComplaints();
  }, []);

  const fetchStudentComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  };

  // Compute live statistics
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = complaints.slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Fetching your campus complaints..." />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card border-0 mb-4 text-white p-4 overflow-hidden position-relative"
        style={{
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #4338ca 100%)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white mb-2">
              <i className="bi bi-mortarboard-fill me-1"></i> {user?.department}
            </span>
            <h3 className="fw-bold text-white mb-1">
              Welcome back, {user?.name}! 👋
            </h3>
            <p className="text-white-50 small mb-0">
              PRN: <strong>{user?.studentId}</strong> | Track your campus facility complaints and
              report new issues quickly.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/student/submit" className="btn btn-warning fw-bold px-4 py-2 shadow">
              <i className="bi bi-plus-circle-fill me-2"></i> Report New Issue
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* 4 Animated Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Reported"
            value={total}
            icon="bi-collection-fill"
            type="primary"
            subtitle="All time complaints"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Pending Review"
            value={pending}
            icon="bi-hourglass-split"
            type="pending"
            subtitle="Awaiting facility triage"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="In Progress"
            value={inProgress}
            icon="bi-arrow-repeat"
            type="inprogress"
            subtitle="Technician assigned"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Resolved"
            value={resolved}
            icon="bi-check-circle-fill"
            type="resolved"
            subtitle="Completed & closed"
          />
        </div>
      </div>

      {/* Main Grid: Recent Complaints + Overview */}
      <div className="row g-4">
        {/* Recent Complaints */}
        <div className="col-lg-8">
          <div className="card card-custom p-4 border bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold text-dark mb-1">Recent Complaints</h5>
                <small className="text-secondary">Your latest submitted maintenance tickets</small>
              </div>
              <Link to="/student/complaints" className="btn btn-outline-custom btn-sm">
                View All ({total}) &rarr;
              </Link>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check2-circle text-success fs-1"></i>
                <h6 className="fw-bold mt-2 text-dark">No Active Complaints!</h6>
                <p className="text-secondary small mb-3">
                  You haven't reported any campus facility issues yet.
                </p>
                <Link to="/student/submit" className="btn btn-primary-custom btn-sm">
                  <i className="bi bi-plus-lg me-1"></i> Report an Issue
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-secondary">
                    <tr>
                      <th>Complaint ID</th>
                      <th>Title &amp; Location</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <span className="fw-bold text-primary small">{c.complaintId}</span>
                          <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            {formatDate(c.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '240px' }}>
                            {c.title}
                          </div>
                          <small className="text-secondary d-block text-truncate" style={{ maxWidth: '240px' }}>
                            <i className="bi bi-geo-alt me-1 text-danger"></i>
                            {c.location}
                          </small>
                        </td>
                        <td>
                          <CategoryBadge category={c.category} />
                        </td>
                        <td>
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/student/complaints/${c._id}`}
                            className="btn btn-light btn-sm border"
                            title="View Details"
                          >
                            <i className="bi bi-eye text-primary"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Campus Notice & Status Progress */}
        <div className="col-lg-4">
          <div className="card card-custom p-4 border bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-pie-chart-fill text-primary me-2"></i>
              Resolution Progress
            </h6>

            {total > 0 ? (
              <div>
                <div className="d-flex justify-content-between small text-secondary mb-1">
                  <span>Resolution Rate</span>
                  <span className="fw-bold text-dark">
                    {Math.round((resolved / total) * 100)}%
                  </span>
                </div>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(resolved / total) * 100}%` }}
                    aria-valuenow={(resolved / total) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div className="small text-secondary pt-2 border-top">
                  <div className="d-flex justify-content-between py-1">
                    <span>
                      <span className="badge bg-warning p-1 rounded-circle me-1"> </span> Pending
                    </span>
                    <span className="fw-bold text-dark">{pending}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span>
                      <span className="badge bg-primary p-1 rounded-circle me-1"> </span> In Progress
                    </span>
                    <span className="fw-bold text-dark">{inProgress}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span>
                      <span className="badge bg-success p-1 rounded-circle me-1"> </span> Resolved
                    </span>
                    <span className="fw-bold text-dark">{resolved}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary small mb-0">No complaint data to calculate resolution metrics.</p>
            )}
          </div>

          {/* Department Facility Guidelines */}
          <div className="card card-custom p-4 border bg-light">
            <h6 className="fw-bold text-dark mb-2">
              <i className="bi bi-info-circle-fill text-info me-2"></i>
              Facility Guidelines
            </h6>
            <ul className="small text-secondary ps-3 mb-0">
              <li className="mb-2">Include exact room or lab numbers for faster technician dispatch.</li>
              <li className="mb-2">Upload clear photos of equipment damage or error screens.</li>
              <li className="mb-2">Urgent priority is reserved for electrical/water hazards.</li>
              <li>You can modify or delete complaints while they are in Pending status.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
