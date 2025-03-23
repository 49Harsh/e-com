import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register customer
export const registerCustomer = async (userData) => {
  try {
    const response = await authApi.post('/register/customer', userData);
    
    // Store token if registration is successful
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // Log the full error for debugging
    console.error('Registration error details:', {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message
    });

    // Throw a more specific error
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

// Register admin
export const registerAdmin = async (userData) => {
  try {
    // Ensure adminCode is sent as a string
    const dataToSend = {
      ...userData,
      adminCode: String(userData.adminCode)
    };
    
    console.log('Sending admin registration request with data:', dataToSend);
    const response = await authApi.post('/register/admin', dataToSend);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Admin registration error:', error.response?.data);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await authApi.post('/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authApi.get('/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await authApi.post('/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
}; 