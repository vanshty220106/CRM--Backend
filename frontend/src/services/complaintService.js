import api from './api';

export const complaintService = {
  getComplaints: async () => {
    return api.get('/complaints');
  },

  getMyComplaints: async () => {
    return api.get('/complaints/me');
  },

  getStats: async () => {
    return api.get('/complaints/stats');
  },

  submitComplaint: async (complaintData) => {
    return api.post('/complaints', complaintData);
  },

  // Admin: update status & add message to tracking timeline
  updateComplaintStatus: async (id, payload) => {
    return api.patch(`/complaints/${id}/status`, payload);
  },
};
