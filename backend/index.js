require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./connection');
const mongoose = require('mongoose');

// Import all routers
const authRoutes = require('./Routes/authRoutes');
const priceRoutes = require('./Routes/priceRoutes');
const feedbackRoutes = require('./Routes/FeedbackRoutes');
const notificationRoutes = require('./Routes/NotificationRoutes');
const comparisionRoutes = require('./Routes/ComparisonRoutes');
const platformRoutes = require('./Routes/platformRoutes');
const sharingRoutes = require('./Routes/SharingRoutes');
const productPriceRouter = require('./Routes/productPriceRouter');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware - disable for local development to avoid CORS issues
// app.use(helmet());
// Use a more permissive helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Logging middleware
app.use(morgan('dev'));

// CORS configuration - make it more permissive for local development
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Access-Control-Allow-Origin']
}));

// Add pre-flight handling for all routes
app.options('*', cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comparisions', comparisionRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/prices', productPriceRouter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Simple test route for checking auth functionality without MongoDB
app.get('/test', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      message: 'Test endpoint is working',
      note: 'You can use testuser/password123 to test login in fallback mode'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/test`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});