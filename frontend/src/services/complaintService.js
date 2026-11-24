/**
 * Complaint Service Endpoints
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

import api from './api';

export const complaintService = {
  // Get complaints list (filtered by user role on backend)
  getComplaints: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  // Get single complaint details
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Submit new complaint (handles multipart/form-data for image uploads)
  createComplaint: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post('/complaints', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // Update existing complaint
  updateComplaint: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/complaints/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};
