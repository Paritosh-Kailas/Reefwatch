import axiosInstance from './axiosInstance';
export const getAllSpecies = (params = {}) => axiosInstance.get('/species', { params });
export const getSpeciesById = (id)        => axiosInstance.get(`/species/${id}`);
export const createSpecies  = (data)      => axiosInstance.post('/species', data);
export const updateSpecies  = (id, data)  => axiosInstance.put(`/species/${id}`, data);
export const deleteSpecies  = (id)        => axiosInstance.delete(`/species/${id}`);
