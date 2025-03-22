import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductForm = ({ product, isEditing = false }) => {
  const navigate = useNavigate();
  const { addProduct, editProduct } = useProducts();
  
  const initialState = {
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    color: '',
    size: '',
    rating: 0,
    featured: false,
    images: [{ public_id: 'temp_id', url: 'https://via.placeholder.com/150' }]
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && product) {
      setFormData(product);
    }
  }, [isEditing, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.size) newErrors.size = 'Size is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEditing) {
        await editProduct(product._id, formData);
      } else {
        await addProduct(formData);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Rating</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 mr-2"
            />
            <label className="text-sm font-medium">Featured Product</label>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
