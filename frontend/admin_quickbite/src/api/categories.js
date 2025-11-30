import api from './axios';

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

export const bulkCreateCategories = async (data, token) => {
    const response = await api.post('/categories/bulk', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
