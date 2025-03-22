import React from 'react';
import { useProducts } from '../context/ProductContext';

const Dashboard = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  // Calculate summary data
  const totalProducts = products.length;
  const featuredProducts = products.filter(product => product.featured).length;
  
  // Calculate total inventory value
  const inventoryValue = products.reduce((total, product) => {
    return total + (product.price * product.stock);
  }, 0);
  
  // Get products with low stock (less than 10)
  const lowStockProducts = products.filter(product => product.stock < 10);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-2">Total Products</div>
          <div className="text-3xl font-bold">{totalProducts}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-2">Featured Products</div>
          <div className="text-3xl font-bold">{featuredProducts}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-2">Inventory Value</div>
          <div className="text-3xl font-bold">${inventoryValue.toFixed(2)}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-2">Low Stock Items</div>
          <div className="text-3xl font-bold">{lowStockProducts.length}</div>
        </div>
      </div>
      
      {lowStockProducts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Products with Low Stock</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Product</th>
                  <th className="py-2 px-4 border-b text-left">Category</th>
                  <th className="py-2 px-4 border-b text-right">Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.slice(0, 5).map(product => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b">{product.title}</td>
                    <td className="py-2 px-4 border-b">{product.category}</td>
                    <td className="py-2 px-4 border-b text-right">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;