import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
      await addToCart(product._id, quantity, selectedSize);
      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleShopNow = async () => {
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
      await addToCart(product._id, quantity, selectedSize);
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to process. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Product not found</p>
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
              src={`http://localhost:5000${product.images[selectedImage].url}`}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={`http://localhost:5000${image.url}`}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </button>
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
            <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
            {product.compareAtPrice && (
              <p className="mt-1 text-lg text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="mt-3">
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-7.07 3.716 1.35-7.87L.18 7.466l7.88-1.145L10 0l2.94 6.321 7.88 1.145-6.1 3.965 1.35 7.87z"
                    />
                  </svg>
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">{product.rating} out of 5 stars</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              {product.description}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h3 className="text-sm text-gray-600">Color:</h3>
              <p className="ml-2 text-sm text-gray-900">{product.color}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h3 className="text-sm text-gray-600">Select Size:</h3>
              <div className="ml-2 flex flex-wrap gap-2">
                {product.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <h3 className="text-sm text-gray-600">Quantity:</h3>
              <div className="ml-2 flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 bg-gray-100 rounded-l"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2 py-1 bg-gray-100 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h3 className="text-sm text-gray-600">Stock:</h3>
              <p className="ml-2 text-sm text-gray-900">{product.stock} units</p>
            </div>
          </div>

          {product.featured && (
            <div className="mt-6">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Featured Product
              </span>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleShopNow}
              className="flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700"
              disabled={product.stock === 0}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 