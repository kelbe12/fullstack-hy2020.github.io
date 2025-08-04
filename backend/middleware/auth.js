const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is invalid. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Server error during authentication'
    });
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

// Check if vendor is approved
exports.checkVendorApproval = (req, res, next) => {
  if (req.user.role === 'vendor' && !req.user.vendorInfo.isApproved) {
    return res.status(403).json({
      status: 'error',
      message: 'Your vendor account is pending approval. Please wait for admin approval.'
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Check resource ownership (for vendors accessing their own resources)
exports.checkOwnership = (Model, resourceParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params[resourceParam]);
      
      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Resource not found'
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Vendors can only access their own resources
      if (req.user.role === 'vendor') {
        if (resource.vendor && resource.vendor.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied. You can only access your own resources.'
          });
        }
      }

      // Customers can access their own orders/reviews
      if (req.user.role === 'customer') {
        if (resource.user && resource.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied. You can only access your own resources.'
          });
        }
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Server error while checking resource ownership'
      });
    }
  };
};