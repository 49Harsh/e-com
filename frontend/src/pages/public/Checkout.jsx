import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: formData
      };

      const response = await createOrder(orderData);

      if (response.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h3 className="text-xl font-medium mb-4">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>{item.product.title} (x{item.quantity})</span>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{cart.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div>
          <h3 className="text-xl font-medium mb-4">Shipping Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="w-full border rounded p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 