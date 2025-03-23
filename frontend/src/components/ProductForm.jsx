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
    compareAtPrice: '',
    cost: '',
    stock: '',
    category: '',
    color: '',
    size: [],
    rating: 0,
    featured: false,
    images: []
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  const sizes = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Double XL (XXL)' }
  ];

  useEffect(() => {
    if (isEditing && product) {
      setFormData(product);
    }
  }, [isEditing, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'size') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedOptions
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSizeChange = (size) => {
    const currentSizes = [...formData.size];
    const sizeIndex = currentSizes.indexOf(size);
    
    if (sizeIndex === -1) {
      currentSizes.push(size);
    } else {
      currentSizes.splice(sizeIndex, 1);
    }
    
    setFormData({
      ...formData,
      size: currentSizes
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
    if (formData.size.length === 0) newErrors.size = 'Size is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'size') {
          // Append each size separately
          formData.size.forEach((size, index) => {
            formDataToSend.append(`size[${index}]`, size);
          });
        } else if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image files if any
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      if (isEditing) {
        await editProduct(product._id, formDataToSend);
      } else {
        await addProduct(formDataToSend);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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
            <label className="block mb-2 text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formData.price && (
              <p className="text-sm text-gray-500 mt-1">
                Formatted: {formatPrice(formData.price)}
              </p>
            )}
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Compare at Price (₹)</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.compareAtPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Formatted: {formatPrice(formData.compareAtPrice)}
              </p>
            )}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.cost && (
              <p className="text-sm text-gray-500 mt-1">
                Formatted: {formatPrice(formData.cost)}
              </p>
            )}
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
          
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium">Sizes</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sizes.map((size) => (
                <div
                  key={size.value}
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-all
                    ${formData.size.includes(size.value)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400'
                    }
                  `}
                  onClick={() => handleSizeChange(size.value)}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.size.includes(size.value)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{size.label}</span>
                  </div>
                </div>
              ))}
            </div>
            {errors.size && (
              <p className="text-red-500 text-sm mt-1">{errors.size}</p>
            )}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
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
