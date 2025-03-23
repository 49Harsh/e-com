import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const AdminProductCard = ({ product }) => {
  const { removeProduct } = useProducts();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateMargin = () => {
    if (product.price && product.cost) {
      return ((product.price - product.cost) / product.price * 100).toFixed(2);
    }
    return 0;
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
          <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
            Margin: {calculateMargin()}%
          </div>
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
        
        {/* Price Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Selling Price:</span>
            <div className="text-lg font-bold">{formatPrice(product.price)}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Cost:</span>
            <div className="text-lg font-bold">{formatPrice(product.cost)}</div>
          </div>
          {product.compareAtPrice && (
            <div>
              <span className="text-sm text-gray-500">Compare at:</span>
              <div className="text-lg line-through text-gray-600">
                {formatPrice(product.compareAtPrice)}
              </div>
            </div>
          )}
        </div>

        {/* Stock and Category */}
        <div className="flex justify-between mb-4">
          <div>
            <span className="text-sm text-gray-500">Stock:</span>
            <div className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock} units
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Category:</span>
            <div className="font-medium">{product.category}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-4 mt-4 flex justify-between">
          <Link 
            to={`/admin/edit-product/${product._id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard; 