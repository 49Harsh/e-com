import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../api/api';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders(); // Using the correct API function
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium" 
                style={{
                  backgroundColor: 
                    order.status === 'Delivered' ? 'rgb(220 252 231)' :
                    order.status === 'Processing' ? 'rgb(254 249 195)' :
                    order.status === 'Shipped' ? 'rgb(219 234 254)' :
                    order.status === 'Cancelled' ? 'rgb(254 226 226)' :
                    'rgb(229 231 235)',
                  color:
                    order.status === 'Delivered' ? 'rgb(22 163 74)' :
                    order.status === 'Processing' ? 'rgb(161 98 7)' :
                    order.status === 'Shipped' ? 'rgb(29 78 216)' :
                    order.status === 'Cancelled' ? 'rgb(220 38 38)' :
                    'rgb(107 114 128)'
                }}
              >
                {order.status}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Items:</h3>
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="font-medium mb-2">Shipping Address:</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>PIN: {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders; 