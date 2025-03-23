import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/public/Navbar';
import AdminNavbar from './components/admin/AdminNavbar';
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminRegister from './pages/auth/AdminRegister';
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/public/Cart';
import OrderConfirmation from './pages/public/OrderConfirmation';
import UserOrders from './pages/public/UserOrders';
import Checkout from './pages/public/Checkout';
import AdminOrders from './pages/admin/Orders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <div className="min-h-screen bg-gray-100">
                      <AdminNavbar />
                      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Routes>
                          <Route index element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="add-product" element={<AddProduct />} />
                          <Route path="edit-product/:id" element={<EditProduct />} />
                        </Routes>
                      </div>
                    </div>
                  </AdminRoute>
                }
              />

              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<UserOrders />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register/admin" element={<AdminRegister />} />
                      </Routes>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Router>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;