import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/orders/admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/orders/admin/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500">
                  Customer: {order.user.name} ({order.user.email})
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Order Items:</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
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
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="font-medium mb-2">Shipping Address:</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="font-medium text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 