import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const departments = [
    'School of Computer Engineering & Technology',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Design (School of Design)',
    'Campus Administration & Maintenance',
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch registered users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.studentId.toLowerCase().includes(q)
      );
    }

    if (selectedDept) {
      result = result.filter((u) => u.department === selectedDept);
    }

    if (selectedRole) {
      result = result.filter((u) => u.role === selectedRole);
    }

    setFilteredUsers(result);
  }, [users, searchQuery, selectedDept, selectedRole]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading registered campus students and staff..." />;
  }

  const studentCount = users.filter((u) => u.role === 'student').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Registered Users &amp; Student Directory</h4>
          <p className="text-secondary small mb-0">
            View student accounts, college PRNs, academic departments, and total complaints filed.
          </p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary px-3 py-2">
            <i className="bi bi-mortarboard-fill me-1"></i> Students: {studentCount}
          </span>
          <span className="badge bg-danger px-3 py-2">
            <i className="bi bi-shield-lock-fill me-1"></i> Admins: {adminCount}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card card-custom p-3 border bg-white mb-4">
        <div className="row g-2">
          {/* Search */}
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by student name, PRN, or email..."
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

          {/* Department Filter */}
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Academic Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="col-lg-2 col-sm-6">
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Reset */}
          <div className="col-lg-1 col-sm-6 text-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              title="Reset Filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('');
                setSelectedRole('');
              }}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card card-custom border bg-white overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people text-muted fs-1"></i>
            <h5 className="fw-bold text-dark mt-2">No Users Found</h5>
            <p className="text-secondary small mb-0">Try searching with a different name or PRN.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th>Student / Staff</th>
                  <th>Student ID / PRN</th>
                  <th>College Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Complaints Filed</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            background:
                              u.role === 'admin'
                                ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark small">{u.name}</div>
                          {u.phone && <small className="text-muted">{u.phone}</small>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border font-monospace">
                        {u.studentId}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary small">{u.email}</span>
                    </td>
                    <td>
                      <span className="small text-dark fw-medium">{u.department}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin' ? 'bg-danger' : 'bg-primary-subtle text-primary'
                        } small text-uppercase`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border px-2 py-1">
                        <i className="bi bi-file-earmark-text me-1 text-primary"></i>
                        {u.complaintCount !== undefined ? u.complaintCount : 0} Tickets
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(u.createdAt)}</small>
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

export default AdminUsersPage;
