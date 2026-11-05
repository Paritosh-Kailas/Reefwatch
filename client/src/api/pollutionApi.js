import axiosInstance from './axiosInstance';
export const getPollutionMap  = (params = {}) => axiosInstance.get('/pollution/map', { params });
export const getPollutionStats = ()             => axiosInstance.get('/pollution/stats');
