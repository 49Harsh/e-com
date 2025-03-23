const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxLength: [100, 'Product title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    size: {
      type: [String],
      validate: {
        validator: function(v) {
          const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
          return v.every(size => validSizes.includes(size));
        },
        message: 'Please select valid sizes'
      },
      required: [true, 'Please select at least one size']
    },
    color: {
      type: String,
      required: [true, 'Please specify product color']
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price must be positive']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price must be positive']
    },
    cost: {
      type: Number,
      min: [0, 'Cost must be positive']
    },
    margin: {
      type: Number,
      default: function() {
        if (this.price && this.cost) {
          return ((this.price - this.cost) / this.price) * 100;
        }
        return 0;
      }
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      default: 0
    },
    images: [
      {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    category: {
      type: String,
      required: [true, 'Please select product category']
    },
    featured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

// Add a pre-save middleware to calculate margin
productSchema.pre('save', function(next) {
  if (this.price && this.cost) {
    this.margin = ((this.price - this.cost) / this.price) * 100;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);