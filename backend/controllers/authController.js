const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register customer
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create customer
    const user = await User.create({
      name,
      email,
      password,
      role: 'customer'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Register admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Debug logs
    console.log('Environment ADMIN_CODE:', process.env.ADMIN_CODE);
    console.log('Received adminCode:', adminCode);
    console.log('Types:', {
      envType: typeof process.env.ADMIN_CODE,
      receivedType: typeof adminCode
    });
    console.log('Strict equality:', process.env.ADMIN_CODE === adminCode);

    // Convert both to strings and trim for comparison
    const envAdminCode = String(process.env.ADMIN_CODE).trim();
    const receivedAdminCode = String(adminCode).trim();

    // Verify admin registration code
    if (!adminCode || envAdminCode !== receivedAdminCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin code',
        debug: {
          received: receivedAdminCode,
          expected: envAdminCode
        }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// Helper function to create token and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
}; 