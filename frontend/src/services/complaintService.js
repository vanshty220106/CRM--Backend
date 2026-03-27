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
    // Protected route, uses interceptor automatically
    return api.post('/complaints', complaintData);
  }
};
