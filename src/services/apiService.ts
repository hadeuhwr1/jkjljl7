// ===========================================================================
// File: src/services/apiService.ts (MODIFIKASI: Tambahkan fungsi getMyAllies)
// Deskripsi: Utility untuk melakukan panggilan API ke backend.
// ===========================================================================
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AlliesListResponse } from '../types/user'; // Import tipe baru

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cigar_ds_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fungsi baru untuk mengambil daftar allies
export const getMyAllies = async (page: number = 1, limit: number = 5): Promise<AlliesListResponse> => {
  try {
    const response = await apiClient.get<AlliesListResponse>('/users/me/allies', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching allies:", error);
    // Melempar error agar bisa ditangani oleh komponen pemanggil
    throw error; 
  }
};


export default apiClient;