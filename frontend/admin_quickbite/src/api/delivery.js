import api from './axios';

// Get all delivery partners (Admin)
export const getAllDeliveryPartners = () => api.get('/delivery/admin/all');

// Update delivery partner status (Approve/Reject)
export const updateDeliveryPartnerStatus = (id, status) => api.put(`/delivery/${id}/status`, { status });
