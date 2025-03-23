import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductCard = ({ product }) => {
  const { removeProduct } = useProducts();

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSizes = (sizes) => {
    if (!sizes || sizes.length === 0) return 'No sizes available';
    return sizes.join(' • ');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await removeProduct(product._id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Add image section */}
      {product.images && product.images.length > 0 && (
        <div className="relative h-48 w-full">
          <img
            src={`http://localhost:5000${product.images[0].url}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              +{product.images.length - 1}
            </div>
          )}
        </div>
      )}
      
      {/* Rest of the card content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
        <div className="text-sm mb-2">
          <span className="font-medium">Category:</span> {product.category}
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-sm">
            <span className="font-medium">Price:</span> {formatPrice(product.price)}
          </div>
          <div className="text-sm">
            <span className="font-medium">In Stock:</span> {product.stock}
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-sm">
            <span className="font-medium">Color:</span> {product.color}
          </div>
          <div className="text-sm">
            <span className="font-medium">Sizes:</span> {formatSizes(product.size)}
          </div>
        </div>
        {product.compareAtPrice && (
          <div className="text-sm mb-2">
            <span className="font-medium">Compare at:</span> {formatPrice(product.compareAtPrice)}
          </div>
        )}
        <div className="text-sm mb-2">
          <span className="font-medium">Rating:</span> {product.rating}/5
        </div>
        {product.featured && (
          <div className="mb-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Featured</span>
          </div>
        )}
        <div className="flex flex-col mb-2">
          <span className="font-medium text-sm mb-1">Available Sizes:</span>
          <div className="flex flex-wrap gap-1">
            {product.size.map((size) => (
              <span
                key={size}
                className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between">
          <Link 
            to={`/edit-product/${product._id}`}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;