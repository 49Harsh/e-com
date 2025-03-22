import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductCard = ({ product }) => {
  const { removeProduct } = useProducts();

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
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
        <div className="text-sm mb-2">
          <span className="font-medium">Category:</span> {product.category}
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-sm">
            <span className="font-medium">Price:</span> ${product.price}
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
            <span className="font-medium">Size:</span> {product.size}
          </div>
        </div>
        <div className="text-sm mb-2">
          <span className="font-medium">Rating:</span> {product.rating}/5
        </div>
        {product.featured && (
          <div className="mb-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Featured</span>
          </div>
        )}
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
