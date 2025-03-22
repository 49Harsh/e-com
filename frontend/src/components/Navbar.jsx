import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">E-Commerce Admin</Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/products" className="hover:text-gray-300">Products</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
