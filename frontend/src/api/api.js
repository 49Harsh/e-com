import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create axios instance for JSON requests
const jsonApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for multipart/form-data requests
const formDataApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add token to all requests
const addAuthHeader = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Add interceptors to both API instances
jsonApi.interceptors.request.use(addAuthHeader);
formDataApi.interceptors.request.use(addAuthHeader);

export const getProducts = async () => {
  try {
    const response = await jsonApi.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await jsonApi.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error.response?.data || error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await formDataApi.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await formDataApi.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await jsonApi.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response?.data || error.message);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await jsonApi.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error.response?.data || error.message);
    throw error;
  }
};

export const addToCart = async (productId, quantity, size) => {
  try {
    const response = await jsonApi.post('/cart', { productId, quantity, size });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await jsonApi.put('/cart/item', { itemId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error.response?.data || error.message);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await jsonApi.delete(`/cart/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error.response?.data || error.message);
    throw error;
  }
};
  