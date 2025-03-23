// controllers/productController.js
const Product = require('../models/Product');

// Create new product   =>   POST /api/v1/products
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // If files were uploaded, add their paths to the product data
    if (req.files) {
      productData.images = req.files.map(file => ({
        public_id: file.filename,
        url: `/uploads/${file.filename}`
      }));
    }

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all products   =>   GET /api/v1/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get single product details   =>   GET /api/v1/products/:id
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update product   =>   PUT /api/v1/products/:id
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productData = req.body;
    
    // Handle size array properly
    if (productData.size) {
      productData.size = Array.isArray(productData.size) ? productData.size : [productData.size];
    }

    // If new files were uploaded, add their paths
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        public_id: file.filename,
        url: `/uploads/${file.filename}`
      }));
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product   =>   DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};