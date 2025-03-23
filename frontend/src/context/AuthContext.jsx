import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerCustomer, registerAdmin, logoutUser, getCurrentUser } from '../api/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await getCurrentUser();
        setUser(data);
      }
    } catch (error) {
      console.error('Check user error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { user } = await loginUser({ email, password });
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerCustomer(userData);
      
      if (response.success) {
        setUser(response.user);
        toast.success(response.message || 'Registration successful!');
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerAsAdmin = async (userData) => {
    try {
      setError(null);
      const { user } = await registerAdmin(userData);
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Admin registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    registerAsAdmin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 