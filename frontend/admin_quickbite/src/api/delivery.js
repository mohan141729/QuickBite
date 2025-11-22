import api from './axios';

// Get all delivery partners (Admin)
export const getAllDeliveryPartners = () => api.get('/api/delivery/admin/all');

// Update delivery partner status (Approve/Reject)
export const updateDeliveryPartnerStatus = (id, status) => api.put(`/api/delivery/${id}/status`, { status });
