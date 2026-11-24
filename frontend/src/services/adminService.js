/**
 * Admin Service Endpoints
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

import api from './api';

export const adminService = {
  // Get admin dashboard metrics and analytics
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get all complaints with administrative filters
  getComplaints: async (params = {}) => {
    const response = await api.get('/admin/complaints', { params });
    return response.data;
  },

  // Update complaint status, assign staff, and provide remarks
  updateStatus: async (id, data) => {
    const response = await api.put(`/admin/complaints/${id}/status`, data);
    return response.data;
  },

  // Get registered users/students
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
};
