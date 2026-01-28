import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบเมื่อ component mount - ดึง user จาก API ถ้ามี token
  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success && response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('token', token);
  };

  const logout = () => {
    console.log('🔐 Logging out - clearing all data');
    setUser(null);
    setIsAuthenticated(false);
    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();
  };

  // Idle Timeout Logic
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          logout();
          Swal.fire({
            icon: 'info',
            title: 'หมดเวลาการใช้งาน',
            text: 'กรุณาเข้าสู่ระบบใหม่เพื่อความปลอดภัย',
            confirmButtonColor: '#8B4513'
          });
          navigate('/login');
        }, 10 * 60 * 1000); // 10 minutes
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // Set up listeners
    if (isAuthenticated) {
      resetTimer(); // Start timer immediately when authenticated
      events.forEach(event => window.addEventListener(event, resetTimer));
    }

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};