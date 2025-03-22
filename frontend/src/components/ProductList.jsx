import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No products found.</p>
        <Link to="/add-product" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <Link to="/add-product" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Product
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;