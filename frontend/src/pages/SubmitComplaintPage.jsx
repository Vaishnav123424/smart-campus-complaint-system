import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import NotificationToast from '../components/NotificationToast';

const SubmitComplaintPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Classroom maintenance',
    description: '',
    location: '',
    priority: 'Medium',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
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

  const quickLocations = [
    'B-Building, 2nd Floor, Room B-204',
    'A-Building, 3rd Floor, Computer Lab 304',
    'Central Library, 1st Floor, Reading Zone',
    'D-Building, IoT & Embedded Systems Lab',
    'Mechanical Workshop, Ground Floor',
    'Main Auditorium, Ground Floor',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return setError('Image file size must be less than 5MB.');
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return setError('Please provide a complaint title.');
    }
    if (!formData.description.trim()) {
      return setError('Please provide a detailed description of the issue.');
    }
    if (!formData.location.trim()) {
      return setError('Please specify the campus location.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use FormData to send file upload and fields together
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('priority', formData.priority);

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await complaintService.createComplaint(data);

      if (res.success) {
        setToast({
          show: true,
          message: `Complaint ${res.complaint.complaintId} lodged successfully!`,
          type: 'success',
        });

        setTimeout(() => {
          navigate('/student/complaints');
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to submit complaint. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-2">
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card card-custom border-0 p-4 p-md-5 bg-white shadow-sm">
            {/* Header */}
            <div className="border-bottom pb-3 mb-4">
              <h4 className="fw-bold text-dark mb-1">
                <i className="bi bi-file-earmark-plus text-primary me-2"></i>
                Submit Campus Maintenance Complaint
              </h4>
              <p className="text-secondary small mb-0">
                Provide accurate details to help MITAOE facility teams inspect and resolve the problem rapidly.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Title */}
                <div className="col-12">
                  <label className="form-label">
                    Complaint Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Projector lamp burnt out during lectures"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength="100"
                    required
                  />
                  <small className="text-muted d-block mt-1">
                    Keep it short and descriptive (Max 100 characters)
                  </small>
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label">
                    Facility Category <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="col-md-6">
                  <label className="form-label">
                    Urgency Priority <span className="text-danger">*</span>
                  </label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="Low">Low - Minor aesthetic or cosmetic issue</option>
                    <option value="Medium">Medium - Regular classroom / lab amenity issue</option>
                    <option value="High">High - Impeding active classes or practical sessions</option>
                    <option value="Urgent">Urgent - Safety hazard, water leakage, or power failure</option>
                  </select>
                </div>

                {/* Location */}
                <div className="col-12">
                  <label className="form-label">
                    Campus Location (Building, Floor, Room/Lab) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. B-Building, 2nd Floor, Room B-204"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  {/* Quick suggestion pills */}
                  <div className="d-flex flex-wrap gap-2 mt-2 align-items-center">
                    <small className="text-muted fw-semibold">Quick pick:</small>
                    {quickLocations.map((loc, i) => (
                      <button
                        key={i}
                        type="button"
                        className="btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill small"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setFormData({ ...formData, location: loc })}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">
                    Detailed Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe what is broken, what error message is displayed, or what repairs are needed..."
                    value={formData.description}
                    onChange={handleChange}
                    maxLength="1000"
                    required
                  ></textarea>
                  <div className="d-flex justify-content-between small text-muted mt-1">
                    <span>Be specific with workstation number, machine model, or timing.</span>
                    <span>{formData.description.length} / 1000</span>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-12">
                  <label className="form-label">
                    Attach Photo Evidence <span className="text-muted fw-normal">(Optional, Max 5MB)</span>
                  </label>

                  {!previewUrl ? (
                    <div
                      className="border border-2 border-dashed rounded-3 p-4 text-center bg-light position-relative"
                      style={{ cursor: 'pointer', borderColor: '#cbd5e1' }}
                    >
                      <input
                        type="file"
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        style={{ cursor: 'pointer' }}
                      />
                      <i className="bi bi-cloud-arrow-up-fill fs-1 text-primary"></i>
                      <h6 className="fw-bold mt-2 text-dark mb-1">Click to upload photo or drag &amp; drop</h6>
                      <p className="text-secondary small mb-0">PNG, JPG, JPEG, WEBP up to 5MB</p>
                    </div>
                  ) : (
                    <div className="position-relative d-inline-block border rounded-3 p-2 bg-light shadow-sm">
                      <img
                        src={previewUrl}
                        alt="Complaint Preview"
                        style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                        onClick={handleRemoveFile}
                        title="Remove image"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Action Buttons */}
                <div className="col-12 pt-3 border-top d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm"></span>
                        <span>Filing Complaint...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i>
                        <span>Submit Complaint Ticket</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light px-4 border"
                    onClick={() => navigate('/student/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
