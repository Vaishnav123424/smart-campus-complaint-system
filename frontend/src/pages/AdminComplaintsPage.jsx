import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import NotificationToast from '../components/NotificationToast';

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Status & Staff Update Modal
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    complaint: null,
    status: 'Pending',
    assignedStaff: '',
    adminRemarks: '',
    isSaving: false,
  });

  // Delete modal
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

  const maintenanceStaffPresets = [
    'Mr. Sanjay Deshmukh (AV Technician)',
    'Network Team (Mr. Pradeep Joshi)',
    'Electrical Cell (Mr. Ramesh Patil)',
    'Plumbing & Sanitation Unit',
    'Carpentry Maintenance Cell',
    'Housekeeping Supervisor',
    'Lab Incharge (Dept Instrumentation)',
    'Campus Facility Head',
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await adminService.getComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints list.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
    let result = [...complaints];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintId.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.user && c.user.name && c.user.name.toLowerCase().includes(q)) ||
          (c.assignedStaff && c.assignedStaff.toLowerCase().includes(q))
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

    setFilteredComplaints(result);
  }, [complaints, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  // Open update modal
  const handleOpenUpdateModal = (complaint) => {
    setUpdateModal({
      isOpen: true,
      complaint,
      status: complaint.status || 'Pending',
      assignedStaff: complaint.assignedStaff || '',
      adminRemarks: complaint.adminRemarks || '',
      isSaving: false,
    });
  };

  // Submit status update
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setUpdateModal((prev) => ({ ...prev, isSaving: true }));

    try {
      const res = await adminService.updateStatus(updateModal.complaint._id, {
        status: updateModal.status,
        assignedStaff: updateModal.assignedStaff,
        adminRemarks: updateModal.adminRemarks,
      });

      if (res.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === updateModal.complaint._id ? res.complaint : c))
        );
        setToast({
          show: true,
          message: `Ticket ${updateModal.complaint.complaintId} status updated to '${updateModal.status}'.`,
          type: 'success',
        });
        setUpdateModal({ isOpen: false, complaint: null, isSaving: false });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to update complaint status.',
        type: 'error',
      });
      setUpdateModal((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // Handle delete
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
          message: `Complaint ${deleteModal.ticketNumber} deleted permanently.`,
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
    return <LoadingSpinner message="Loading all campus facility complaints..." />;
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
        title="Delete Inappropriate Complaint"
        message={`Are you sure you want to remove complaint ${deleteModal.ticketNumber}? This will permanently remove the record from campus databases.`}
        confirmText="Confirm Delete"
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
          <h4 className="fw-bold text-dark mb-1">Campus Complaint Management</h4>
          <p className="text-secondary small mb-0">
            Triage, assign maintenance staff, record remarks, and update resolution states.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary px-3 py-2 fs-6">
            Total Tickets: {filteredComplaints.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Filter Toolbar */}
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
                placeholder="Search ticket, title, student, staff..."
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

          {/* Category */}
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

          {/* Status */}
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

          {/* Priority */}
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

          {/* Reset button */}
          <div className="col-lg-1 col-md-12 text-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              title="Reset Filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedStatus('');
                setSelectedPriority('');
              }}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card card-custom border bg-white overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted fs-1"></i>
            <h5 className="fw-bold text-dark mt-2">No Complaints Found</h5>
            <p className="text-secondary small mb-3">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th style={{ width: '130px' }}>Ticket ID</th>
                  <th>Student &amp; Dept</th>
                  <th>Complaint Title &amp; Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th className="text-end" style={{ width: '160px' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="fw-bold text-primary small">{c.complaintId}</span>
                      <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {formatDate(c.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark small">{c.user?.name || 'Student'}</div>
                      <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
                        {c.user?.studentId}
                      </small>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '220px' }}>
                        {c.title}
                      </div>
                      <small className="text-secondary d-block text-truncate" style={{ maxWidth: '220px' }}>
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
                      <span className="badge bg-light text-dark border small text-truncate" style={{ maxWidth: '140px' }}>
                        {c.assignedStaff || 'Unassigned'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {/* Manage / Update Status Modal Trigger */}
                        <button
                          type="button"
                          className="btn btn-primary-custom btn-sm py-1 px-2"
                          title="Update Status & Assign Staff"
                          onClick={() => handleOpenUpdateModal(c)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Triage
                        </button>
                        {/* View Details */}
                        <Link
                          to={`/student/complaints/${c._id}`}
                          className="btn btn-light btn-sm border"
                          title="Full Details"
                        >
                          <i className="bi bi-eye text-primary"></i>
                        </Link>
                        {/* Delete Inappropriate */}
                        <button
                          type="button"
                          className="btn btn-light btn-sm border text-danger"
                          title="Delete Inappropriate Complaint"
                          onClick={() => handleDeleteClick(c)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Status & Assign Modal */}
      {updateModal.isOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-dark">
                    Triage Ticket: {updateModal.complaint?.complaintId}
                  </h5>
                  <small className="text-secondary">{updateModal.complaint?.title}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUpdateModal({ isOpen: false, complaint: null })}
                ></button>
              </div>

              <form onSubmit={handleSaveStatus}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Status Selection */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Resolution Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={updateModal.status}
                        onChange={(e) =>
                          setUpdateModal({ ...updateModal, status: e.target.value })
                        }
                        required
                      >
                        <option value="Pending">Pending (Under review)</option>
                        <option value="In Progress">In Progress (Staff assigned)</option>
                        <option value="Resolved">Resolved (Work completed)</option>
                        <option value="Rejected">Rejected (Out of scope / duplicate)</option>
                      </select>
                    </div>

                    {/* Maintenance Staff Assignment */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Assign Maintenance Staff / Team
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Mr. Sanjay Deshmukh (AV Tech)"
                        list="staffPresets"
                        value={updateModal.assignedStaff}
                        onChange={(e) =>
                          setUpdateModal({ ...updateModal, assignedStaff: e.target.value })
                        }
                      />
                      <datalist id="staffPresets">
                        {maintenanceStaffPresets.map((staff, i) => (
                          <option key={i} value={staff} />
                        ))}
                      </datalist>
                      <small className="text-muted">Pick from presets or enter custom technician name</small>
                    </div>

                    {/* Admin Remarks */}
                    <div className="col-12">
                      <label className="form-label">
                        Official Administration Remarks <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Provide details on the inspection, part order status, technician notes, or completion remarks..."
                        value={updateModal.adminRemarks}
                        onChange={(e) =>
                          setUpdateModal({ ...updateModal, adminRemarks: e.target.value })
                        }
                        required
                      ></textarea>
                      <small className="text-secondary">
                        These remarks will be added to the student's live progress timeline.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-light px-4 border"
                    onClick={() => setUpdateModal({ isOpen: false, complaint: null })}
                    disabled={updateModal.isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={updateModal.isSaving}
                  >
                    {updateModal.isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving Updates...
                      </>
                    ) : (
                      'Save Changes & Update Timeline'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
