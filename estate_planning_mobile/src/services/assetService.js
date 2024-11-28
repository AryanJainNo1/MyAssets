import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assetService = {
  getAssets: () => axiosInstance.get('/assets/'),
  createAsset: (data) => axiosInstance.post('/assets/', data),
  updateAsset: (id, data) => axiosInstance.put(`/assets/${id}/`, data),
  deleteAsset: (id) => axiosInstance.delete(`/assets/${id}/`),
}; 