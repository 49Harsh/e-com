import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.compareAtPrice && product.price) {
      const discount = ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image section */}
      {product.images && product.images.length > 0 && (
        <div className="relative h-80 w-full">
          <img
            src={`http://localhost:5000${product.images[0].url}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
              Featured
            </span>
          )}
          {calculateDiscount() > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
              {calculateDiscount()}% OFF
            </span>
          )}
        </div>
      )}
      
      {/* Content section */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h3>
        
        {/* Price section */}
        <div className="flex items-baseline mb-3">
          <span className="text-2xl font-bold text-gray-800">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="ml-2 text-lg text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Rating and Category */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.size.map((size) => (
            <span
              key={size}
              className="px-2 py-1 text-sm font-medium bg-gray-100 rounded-full text-gray-700"
            >
              {size}
            </span>
          ))}
        </div>

        {/* Stock Status */}
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 