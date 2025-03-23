import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddress);
      setFormData(defaultAddress);
    }
  }, [user]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData(address);
    setShowNewAddressForm(false);
  };

  const handleNewAddress = () => {
    setSelectedAddress(null);
    setFormData({
      fullName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    });
    setShowNewAddressForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: selectedAddress || formData,
        saveAddress: showNewAddressForm // Only save if it's a new address
      };

      const response = await createOrder(orderData);

      if (response.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
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
      
      {/* Saved Addresses */}
      {user?.addresses?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((address, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAddress === address ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <p className="font-medium">{address.fullName}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>Phone: {address.phone}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleNewAddress}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {(showNewAddressForm || !user?.addresses?.length) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full border rounded p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                pattern="[0-9]{10}"
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </form>
      )}

      {/* Order Summary */}
      <div className="mt-8">
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

      <button
        type="submit"
        disabled={loading}
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout; 