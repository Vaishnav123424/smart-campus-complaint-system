import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import NotificationToast from '../components/NotificationToast';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    complaintId: null,
    ticketNumber: '',
    isLoading: false,
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const categories = [
    'Classroom maintenance',
    'Laboratory equipment',
    'Wi-Fi and internet issues',
    'Projectors and computers',
    'Washroom cleanliness',
    'Water and electricity problems',
    'Other campus facilities',
  ];

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort logic
  useEffect(() => {
    let result = [...complaints];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintId.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedStatus) {
      result = result.filter((c) => c.status === selectedStatus);
    }

    if (selectedPriority) {
      result = result.filter((c) => c.priority === selectedPriority);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    setFilteredComplaints(result);
  }, [complaints, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const handleDeleteClick = (complaint) => {
    setDeleteModal({
      isOpen: true,
      complaintId: complaint._id,
      ticketNumber: complaint.complaintId,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await complaintService.deleteComplaint(deleteModal.complaintId);
      if (res.success) {
        setComplaints((prev) => prev.filter((c) => c._id !== deleteModal.complaintId));
        setToast({
          show: true,
          message: `Complaint ${deleteModal.ticketNumber} deleted successfully.`,
          type: 'success',
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to delete complaint.',
        type: 'error',
      });
    } finally {
      setDeleteModal({ isOpen: false, complaintId: null, ticketNumber: '', isLoading: false });
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
    return <LoadingSpinner message="Loading your submitted complaints..." />;
  }

  return (
    <div>
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Complaint Ticket"
        message={`Are you sure you want to delete complaint ${deleteModal.ticketNumber}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, complaintId: null, ticketNumber: '', isLoading: false })
        }
      />

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Submitted Complaints</h4>
          <p className="text-secondary small mb-0">
            View history, filter by status, track live resolution timelines, or update tickets.
          </p>
        </div>
        <Link to="/student/submit" className="btn btn-primary-custom d-flex align-items-center gap-2">
          <i className="bi bi-plus-lg"></i>
          <span>Report New Issue</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="card card-custom p-3 border bg-white mb-4">
        <div className="row g-2">
          {/* Search */}
          <div className="col-lg-4 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by ID, title, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-light border-start-0 text-muted"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-lg-2 col-sm-6">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-lg-2 col-sm-6">
            <select
              className="form-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Sort */}
          <div className="col-lg-1 col-md-12 text-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              title="Toggle Sort Order"
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            >
              <i className={`bi ${sortBy === 'newest' ? 'bi-sort-down' : 'bi-sort-up'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      <div className="card card-custom border bg-white overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted fs-1"></i>
            <h5 className="fw-bold text-dark mt-2">No Complaints Match Your Criteria</h5>
            <p className="text-secondary small mb-3">
              Try adjusting your search keywords or resetting filters.
            </p>
            {(searchQuery || selectedCategory || selectedStatus || selectedPriority) && (
              <button
                type="button"
                className="btn btn-light btn-sm border"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSelectedPriority('');
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th style={{ width: '130px' }}>Complaint ID</th>
                  <th>Title &amp; Campus Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end" style={{ width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="fw-bold text-primary small">{c.complaintId}</span>
                    </td>
                    <td>
                      <Link
                        to={`/student/complaints/${c._id}`}
                        className="fw-semibold text-dark text-decoration-none hover-primary d-block"
                      >
                        {c.title}
                      </Link>
                      <small className="text-secondary d-block">
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
                      <small className="text-muted">{formatDate(c.createdAt)}</small>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          to={`/student/complaints/${c._id}`}
                          className="btn btn-light btn-sm border"
                          title="View Details & Timeline"
                        >
                          <i className="bi bi-eye text-primary"></i>
                        </Link>
                        {c.status === 'Pending' && (
                          <button
                            type="button"
                            className="btn btn-light btn-sm border text-danger"
                            title="Delete Pending Complaint"
                            onClick={() => handleDeleteClick(c)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
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

export default MyComplaintsPage;
