const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to database
const connectDB = require('./config/db');

// Root route with DB connection status
app.get('/', (req, res) => {
  res.send('E-commerce API is running. Database connection will be attempted when needed.');
});

// Route files
const productRoutes = require('./routes/productRoutes');

// Mount routers with DB connection check
app.use('/api/v1', async (req, res, next) => {
  const isConnected = await connectDB();
  if (!isConnected) {
    return res.status(500).json({
      success: false,
      message: 'Database connection error. Please try again later.'
    });
  }
  next();
}, productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
});