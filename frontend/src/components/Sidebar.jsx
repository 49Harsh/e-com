import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-100 h-full min-h-screen w-64 p-4 shadow-md">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block p-2 rounded hover:bg-gray-200">Dashboard</Link>
          </li>
          <li>
            <Link to="/products" className="block p-2 rounded hover:bg-gray-200">Products</Link>
          </li>
          <li>
            <Link to="/add-product" className="block p-2 rounded hover:bg-gray-200">Add Product</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;