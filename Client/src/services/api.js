import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.token) {
        sessionStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      // Fix: return the users array directly
      return response.data.users || [];
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาด' };
    }
  },
};

// Repair API
export const repairAPI = {
  createRepair: async (repairData) => {
    try {
      const response = await api.post('/repair', repairData);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล';
      throw new Error(errorMessage);
    }
  },

  getAllRepairs: async () => {
    try {
      const response = await api.get('/repair');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      throw new Error(errorMessage);
    }
  },

  getRepairById: async (id) => {
    try {
      const response = await api.get(`/repair/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      throw new Error(errorMessage);
    }
  },

  updateRepair: async (id, repairData) => {
    try {
      const response = await api.put(`/repair/${id}`, repairData);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการอัปเดต';
      throw new Error(errorMessage);
    }
  },

  deleteRepair: async (id) => {
    try {
      const response = await api.delete(`/repair/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการลบ';
      throw new Error(errorMessage);
    }
  },
};

// Moving API
export const movingAPI = {
  createMoving: async (movingData) => {
    try {
      const response = await api.post('/moving', movingData);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล';
      throw new Error(errorMessage);
    }
  },

  getAllMoving: async () => {
    try {
      const response = await api.get('/moving');
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      throw new Error(errorMessage);
    }
  },

  getMovingById: async (id) => {
    try {
      const response = await api.get(`/moving/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      throw new Error(errorMessage);
    }
  },

  updateMoving: async (id, movingData) => {
    try {
      const response = await api.put(`/moving/${id}`, movingData);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการอัปเดต';
      throw new Error(errorMessage);
    }
  },

  deleteMoving: async (id) => {
    try {
      const response = await api.delete(`/moving/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการลบ';
      throw new Error(errorMessage);
    }
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (imageData, fileName) => {
    try {
      const response = await api.post('/upload', {
        imageData,
        fileName
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการอัพโหลดรูป';
      throw new Error(errorMessage);
    }
  },

  deleteImage: async (fileName) => {
    try {
      const response = await api.delete('/upload', {
        data: { fileName }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เกิดข้อผิดพลาดในการลบรูป';
      throw new Error(errorMessage);
    }
  }
};

export default api;