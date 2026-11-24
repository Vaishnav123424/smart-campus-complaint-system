import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative analytics.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating campus facility analytics & metrics..." />;
  }

  const {
    totalStudents = 0,
    totalComplaints = 0,
    pendingComplaints = 0,
    inProgressComplaints = 0,
    resolvedComplaints = 0,
    rejectedComplaints = 0,
    categoryCounts = {},
    priorityCounts = {},
    recentComplaints = [],
  } = stats || {};

  const resolutionRate =
    totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  return (
    <div>
      {/* Top Banner */}
      <div
        className="card border-0 mb-4 text-white p-4 overflow-hidden position-relative"
        style={{
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 50%, #312e81 100%)',
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-danger text-white mb-2">
              <i className="bi bi-shield-lock-fill me-1"></i> FACILITY ADMINISTRATION CONSOLE
            </span>
            <h3 className="fw-bold text-white mb-1">MITAOE Campus Facility Overview</h3>
            <p className="text-white-50 small mb-0">
              Real-time monitoring of campus infrastructure, complaint distribution, and technician triage.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/complaints" className="btn btn-primary-custom px-3 py-2 shadow-sm">
              <i className="bi bi-card-checklist me-2"></i> Manage All Complaints
            </Link>
            <Link to="/admin/users" className="btn btn-outline-light px-3 py-2">
              <i className="bi bi-people me-2"></i> Student Directory
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

      {/* 5 Key Metrics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl">
          <StatCard
            title="Registered Students"
            value={totalStudents}
            icon="bi-people-fill"
            type="primary"
            subtitle="Campus accounts"
          />
        </div>
        <div className="col-sm-6 col-xl">
          <StatCard
            title="Total Complaints"
            value={totalComplaints}
            icon="bi-card-text"
            type="primary"
            subtitle="All logged tickets"
          />
        </div>
        <div className="col-sm-6 col-xl">
          <StatCard
            title="Pending Review"
            value={pendingComplaints}
            icon="bi-hourglass-split"
            type="pending"
            subtitle="Require immediate triage"
          />
        </div>
        <div className="col-sm-6 col-xl">
          <StatCard
            title="In Progress"
            value={inProgressComplaints}
            icon="bi-arrow-repeat"
            type="inprogress"
            subtitle="Technician dispatched"
          />
        </div>
        <div className="col-sm-6 col-xl">
          <StatCard
            title="Resolved Tickets"
            value={resolvedComplaints}
            icon="bi-check-circle-fill"
            type="resolved"
            subtitle={`${resolutionRate}% resolution rate`}
          />
        </div>
      </div>

      {/* Charts & Analytics Row */}
      <div className="row g-4 mb-4">
        {/* Category Breakdown Chart */}
        <div className="col-lg-7">
          <div className="card card-custom p-4 border bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                  Complaints by Campus Facility
                </h5>
                <small className="text-secondary">Distribution of reported infrastructure issues</small>
              </div>
              <span className="badge bg-light text-secondary border">Total: {totalComplaints}</span>
            </div>

            <div className="mt-3">
              {Object.keys(categoryCounts).length === 0 ? (
                <p className="text-secondary small">No category data recorded.</p>
              ) : (
                Object.entries(categoryCounts).map(([cat, count], idx) => {
                  const percentage = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                  return (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-medium text-dark">{cat}</span>
                        <span className="text-secondary">
                          <strong>{count}</strong> ({percentage}%)
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                          }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="col-lg-5">
          <div className="card card-custom p-4 border bg-white h-100">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-pie-chart-fill text-warning me-2"></i>
              Urgency &amp; Resolution Status
            </h5>
            <small className="text-secondary d-block mb-3">Ticket triage metrics</small>

            {/* Urgency Progress */}
            <div className="mb-4">
              <h6 className="fw-bold small text-muted text-uppercase mb-2">Priority Breakdown</h6>
              <div className="row g-2 text-center">
                <div className="col-3">
                  <div className="p-2 rounded bg-danger bg-opacity-10 border border-danger border-opacity-25">
                    <div className="fw-bold text-danger fs-5">{priorityCounts.Urgent || 0}</div>
                    <small className="text-danger fw-semibold" style={{ fontSize: '0.7rem' }}>Urgent</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 rounded bg-warning bg-opacity-10 border border-warning border-opacity-25">
                    <div className="fw-bold text-warning-emphasis fs-5">{priorityCounts.High || 0}</div>
                    <small className="text-warning-emphasis fw-semibold" style={{ fontSize: '0.7rem' }}>High</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 rounded bg-info bg-opacity-10 border border-info border-opacity-25">
                    <div className="fw-bold text-info fs-5">{priorityCounts.Medium || 0}</div>
                    <small className="text-info fw-semibold" style={{ fontSize: '0.7rem' }}>Medium</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 rounded bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                    <div className="fw-bold text-secondary fs-5">{priorityCounts.Low || 0}</div>
                    <small className="text-secondary fw-semibold" style={{ fontSize: '0.7rem' }}>Low</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Team Active Roster */}
            <div>
              <h6 className="fw-bold small text-muted text-uppercase mb-2">Facility Service Teams</h6>
              <div className="list-group list-group-flush small">
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-lightning-charge text-danger me-2"></i>Electrical &amp; AC Cell
                  </span>
                  <span className="badge bg-success-subtle text-success">Active On-Duty</span>
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-wifi text-success me-2"></i>IT &amp; Network Infrastructure
                  </span>
                  <span className="badge bg-success-subtle text-success">Active On-Duty</span>
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-projector text-warning me-2"></i>Smart AV &amp; Projector Cell
                  </span>
                  <span className="badge bg-success-subtle text-success">Active On-Duty</span>
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-droplet text-primary me-2"></i>Plumbing &amp; Sanitation
                  </span>
                  <span className="badge bg-success-subtle text-success">Active On-Duty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card card-custom p-4 border bg-white">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 className="fw-bold text-dark mb-1">Recent Campus Complaints</h5>
            <small className="text-secondary">Latest tickets logged across all college departments</small>
          </div>
          <Link to="/admin/complaints" className="btn btn-outline-custom btn-sm">
            View All ({totalComplaints}) &rarr;
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <p className="text-secondary small mb-0 text-center py-4">No recent complaints available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th>Ticket ID</th>
                  <th>Student &amp; Department</th>
                  <th>Title &amp; Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th className="text-end">Manage</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="fw-bold text-primary small">{c.complaintId}</span>
                      <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {formatDate(c.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark small">{c.user?.name || 'Student'}</div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        {c.user?.department?.split(' ')[0] || 'MITAOE'}
                      </small>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                        {c.title}
                      </div>
                      <small className="text-secondary d-block text-truncate" style={{ maxWidth: '200px' }}>
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
                    <td>
                      <span className="badge bg-light text-dark border small">
                        {c.assignedStaff || 'Unassigned'}
                      </span>
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
  );
};

export default AdminDashboard;
