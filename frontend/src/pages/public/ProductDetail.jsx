import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getProduct } from '../../api/api';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItemToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.product);
        // Set default size if available
        if (response.product.size && response.product.size.length > 0) {
          setSelectedSize(response.product.size[0]);
        }
      } catch (err) {
        setError('Failed to fetch product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await addItemToCart(product._id, quantity, selectedSize);
      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to continue shopping');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      await addItemToCart(product._id, quantity, selectedSize);
      navigate('/checkout');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process. Please try again.');
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-lg font-medium">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="relative">
            <img
              src={`http://localhost:5000${product.images[0].url}`}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${image.url}`}
                  alt={`Product ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <div className="flex items-center">
              <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="ml-4 text-lg text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600">Description</h3>
            <div className="mt-4 prose prose-sm text-gray-500">
              {product.description}
            </div>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-600">Select Size</h3>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } px-4 py-2 text-sm font-medium rounded-md focus:outline-none`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-600">Quantity</h3>
            <div className="mt-2 flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-l-md hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 border rounded-r-md hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock status */}
          <div className="mt-4">
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 