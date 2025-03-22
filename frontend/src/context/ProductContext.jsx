import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import { toast } from 'react-toastify';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const data = await createProduct(productData);
      setProducts([...products, data.product]);
      toast.success('Product added successfully');
      return data.product;
    } catch (err) {
      setError('Failed to add product');
      toast.error('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id, productData) => {
    setLoading(true);
    try {
      const data = await updateProduct(id, productData);
      setProducts(products.map(product => 
        product._id === id ? data.product : product
      ));
      toast.success('Product updated successfully');
      return data.product;
    } catch (err) {
      setError('Failed to update product');
      toast.error('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      setError('Failed to delete product');
      toast.error('Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      fetchProducts,
      addProduct,
      editProduct,
      removeProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};