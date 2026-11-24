import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import StatusTimeline from '../components/StatusTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationToast from '../components/NotificationToast';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaintById(id);
      if (res.success) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to retrieve complaint details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving complaint details and tracking history..." />;
  }

  if (error || !complaint) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
          <h5 className="fw-bold">Unable to Load Complaint</h5>
          <p className="small mb-3">{error || 'Complaint not found.'}</p>
          <button
            onClick={() => navigate(isAdmin ? '/admin/complaints' : '/student/complaints')}
            className="btn btn-primary btn-sm"
          >
            &larr; Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  const backendOrigin =
    import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : (typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
        ? ''
        : 'http://localhost:5000');

  const imageSrc = complaint.image
    ? complaint.image.startsWith('http')
      ? complaint.image
      : `${backendOrigin}${complaint.image}`
    : '';

  return (
    <div className="container py-2">
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Breadcrumb & Navigation */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => navigate(isAdmin ? '/admin/complaints' : '/student/complaints')}
          className="btn btn-light btn-sm border d-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to {isAdmin ? 'All Complaints' : 'My Complaints'}</span>
        </button>

        <span className="badge bg-light text-secondary border px-3 py-2">
          Ticket Ref: <strong className="text-dark">{complaint.complaintId}</strong>
        </span>
      </div>

      <div className="row g-4">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="col-lg-8">
          <div className="card card-custom p-4 border bg-white mb-4">
            {/* Header info */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <small className="text-muted">
                <i className="bi bi-clock me-1"></i>
                Filed on {formatDate(complaint.createdAt)}
              </small>
            </div>

            <h3 className="fw-bold text-dark mb-2">{complaint.title}</h3>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-4 text-secondary small">
              <CategoryBadge category={complaint.category} />
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-geo-alt-fill text-danger"></i>
                <strong className="text-dark">{complaint.location}</strong>
              </span>
            </div>

            <hr className="my-3 text-muted opacity-25" />

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">Complaint Description</h6>
              <div
                className="p-3 rounded-3 bg-light border text-secondary"
                style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
              >
                {complaint.description}
              </div>
            </div>

            {/* Attached Photo */}
            {complaint.image && (
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Attached Photo Evidence</h6>
                <div
                  className="position-relative d-inline-block border rounded-3 overflow-hidden shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={imageSrc}
                    alt="Complaint Evidence"
                    style={{
                      maxHeight: '260px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-2 text-white small d-flex align-items-center justify-content-between"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)' }}
                  >
                    <span>Click to enlarge photo</span>
                    <i className="bi bi-arrows-fullscreen"></i>
                  </div>
                </div>
              </div>
            )}

            {/* Facility Admin Remarks Block */}
            <div className="card border-primary border-opacity-25 bg-primary-subtle p-3 mb-4 rounded-3">
              <h6 className="fw-bold text-primary mb-1">
                <i className="bi bi-chat-left-dots-fill me-2"></i>
                Official Facility Administration Remarks
              </h6>
              <p className="small text-secondary mb-0">
                {complaint.adminRemarks || 'No additional remarks provided by administration yet.'}
              </p>
            </div>

            {/* Progress Timeline */}
            <div>
              <h5 className="fw-bold text-dark mb-2">
                <i className="bi bi-activity text-primary me-2"></i>
                Progress &amp; Resolution Timeline
              </h5>
              <p className="text-secondary small mb-3">
                Chronological audit trail of all status transitions, technician remarks, and inspections.
              </p>

              <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Student/Staff Info */}
        <div className="col-lg-4">
          {/* Submitter Info Card */}
          <div className="card card-custom p-4 border bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-person-badge-fill text-primary me-2"></i>
              Student Information
            </h6>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '46px',
                  height: '46px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                }}
              >
                {complaint.user?.name ? complaint.user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-0">{complaint.user?.name || 'Student Submitter'}</h6>
                <small className="text-muted">{complaint.user?.studentId || 'N/A'}</small>
              </div>
            </div>

            <div className="small text-secondary pt-2 border-top">
              <div className="mb-2">
                <strong className="text-dark d-block">Department:</strong>
                <span>{complaint.user?.department || 'Department not specified'}</span>
              </div>
              <div className="mb-2">
                <strong className="text-dark d-block">Email:</strong>
                <span>{complaint.user?.email || 'N/A'}</span>
              </div>
              {complaint.user?.phone && (
                <div>
                  <strong className="text-dark d-block">Contact Phone:</strong>
                  <span>{complaint.user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Assignment Card */}
          <div className="card card-custom p-4 border bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-tools text-primary me-2"></i>
              Maintenance Assignment
            </h6>

            <div className="p-3 bg-light rounded-3 border mb-3">
              <small className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '0.7rem' }}>
                Assigned Technician / Cell
              </small>
              <div className="fw-bold text-dark fs-6 mt-1">
                {complaint.assignedStaff || 'Unassigned'}
              </div>
            </div>

            <div className="small text-secondary">
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Last Updated:</span>
                <span className="text-dark fw-medium">{formatDate(complaint.updatedAt)}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span>Current Status:</span>
                <span className="text-dark fw-bold">{complaint.status}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-3 pt-3 border-top">
                <Link
                  to="/admin/complaints"
                  className="btn btn-outline-primary btn-sm w-100 fw-semibold"
                >
                  Manage Status in Admin Console &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {showImageModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 pb-0 justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center p-2">
                <img
                  src={imageSrc}
                  alt="Enlarged Evidence"
                  className="img-fluid rounded-3 shadow"
                  style={{ maxHeight: '80vh' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsPage;
