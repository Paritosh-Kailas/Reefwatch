import axiosInstance from './axiosInstance';
export const getAllCoral      = ()     => axiosInstance.get('/coral');
export const getCoralById    = (id)   => axiosInstance.get(`/coral/${id}`);
export const createCoral     = (data) => axiosInstance.post('/coral', data);
export const deleteCoral     = (id)   => axiosInstance.delete(`/coral/${id}`);
