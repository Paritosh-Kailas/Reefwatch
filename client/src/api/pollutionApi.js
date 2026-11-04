 import axiosInstance from './axiosInstance';

// baseURL in axiosInstance should end with /api
export const getPollutionMap = (params = {}) => axiosInstance.get('/pollution/map', { params });
