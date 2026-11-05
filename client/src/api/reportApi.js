import axiosInstance from './axiosInstance';
export const getAllReports  = ()     => axiosInstance.get('/reports');
export const getReportById = (id)   => axiosInstance.get(`/reports/${id}`);
export const createReport  = (data) => axiosInstance.post('/reports', data);
export const deleteReport  = (id)   => axiosInstance.delete(`/reports/${id}`);
