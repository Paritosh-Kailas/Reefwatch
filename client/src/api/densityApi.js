import axiosInstance from './axiosInstance';
export const getDensityMap   = (params = {}) => axiosInstance.get('/density/map', { params });
export const getDensityStats = ()            => axiosInstance.get('/density/stats');
