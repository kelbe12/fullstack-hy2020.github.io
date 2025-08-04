const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required']
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  attributes: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      value: String,
      price: Number,
      quantity: Number,
      sku: String,
      image: {
        public_id: String,
        url: String
      }
    }]
  }],
  tags: [{
    type: String,
    trim: true
  }],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'm'],
      default: 'cm'
    }
  },
  shipping: {
    free: {
      type: Boolean,
      default: false
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadable: {
    isDownloadable: {
      type: Boolean,
      default: false
    },
    files: [{
      name: String,
      url: String,
      size: Number
    }]
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    images: [{
      public_id: String,
      url: String
    }],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedAt: Date,
  rejectionReason: String,
  publishedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ vendor: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sku: 1 });

// Virtual for calculating discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  if (!this.trackQuantity) return true;
  return this.quantity > 0;
});

// Virtual for checking if product is low stock
productSchema.virtual('isLowStock').get(function() {
  if (!this.trackQuantity) return false;
  return this.quantity <= this.lowStockThreshold;
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = Number((totalRating / this.reviews.length).toFixed(1));
  this.rating.count = this.reviews.length;
};

// Pre-save middleware to update rating
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

// Method to check if user can review
productSchema.methods.canUserReview = function(userId) {
  return !this.reviews.some(review => review.user.toString() === userId.toString());
};

module.exports = mongoose.model('Product', productSchema);