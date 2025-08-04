# 🛒 Multivendor Marketplace

A full-stack multivendor e-commerce platform with web, mobile, and admin panel built for learning modern web development.

## 🎯 Project Overview

This is a comprehensive multivendor marketplace that includes:
- **Customer Web App** - Browse products, place orders, manage account
- **Vendor Dashboard** - Manage products, orders, and business analytics  
- **Admin Panel** - Manage vendors, products, orders, and platform settings
- **Mobile App** - React Native app for customers and vendors
- **REST API** - Node.js backend with MongoDB

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server and API
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing  
- **Cloudinary** - Image storage
- **Express Validator** - Input validation

### Web Frontend  
- **Next.js** - React framework with SSR
- **React** - UI library
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Axios** - HTTP client

### Mobile App
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform
- **React Navigation** - Navigation

## 📁 Project Structure

```
multivendor-marketplace/
├── backend/              # Node.js API server
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── web-frontend/        # Next.js web application
├── mobile-app/          # React Native mobile app
└── shared/              # Shared utilities and types
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone and Setup Backend

```bash
cd multivendor-marketplace/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm run dev
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/multivendor-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` with your cloud MongoDB connection string.

### 4. Test the API

The backend should be running on `http://localhost:5000`

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

### Users, Vendors, Products, Orders, Admin
- Coming soon! (Placeholder routes currently available)

## 🎭 User Roles

### Customer
- Browse products and vendors
- Add products to cart and wishlist
- Place and track orders
- Write product reviews
- Manage profile and addresses

### Vendor
- Manage product catalog
- Process orders
- View sales analytics
- Manage business profile
- Handle customer inquiries

### Admin
- Approve vendor applications
- Manage all products and orders
- View platform analytics
- Manage users and vendors
- Configure platform settings

## 🔐 Authentication Flow

1. **Registration**: Users register with email verification
2. **Login**: JWT token-based authentication
3. **Role-based Access**: Different permissions for customers, vendors, and admins
4. **Vendor Approval**: Vendors need admin approval before selling

## 📱 Next Steps

### Phase 1: Backend API (Current)
- ✅ Project setup and structure
- ✅ User authentication system
- ✅ Database models
- ⏳ Product management APIs
- ⏳ Order management APIs
- ⏳ Admin APIs

### Phase 2: Web Frontend
- Next.js setup
- Authentication pages
- Product catalog
- Shopping cart
- Vendor dashboard
- Admin panel

### Phase 3: Mobile App
- React Native setup with Expo
- Customer mobile app
- Vendor mobile app
- Push notifications

### Phase 4: Advanced Features
- Payment integration
- Real-time notifications
- Advanced analytics
- Multi-language support
- SEO optimization

## 🤝 Contributing

This is a learning project! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)
- [React Documentation](https://reactjs.org/docs/)
- [Next.js Learn](https://nextjs.org/learn)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed for learning.

---

**Happy Coding! 🚀**

Start with the backend API, then move to the web frontend, and finally the mobile app. Each phase builds upon the previous one, giving you a complete full-stack development experience.