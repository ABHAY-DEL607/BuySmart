require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./connection');

// Import all routers
const authRoutes = require('./Routes/authRoutes');
const priceRoutes = require('./Routes/priceRoutes');
const feedbackRoutes = require('./Routes/FeedbackRoutes');
const notificationRoutes = require('./Routes/NotificationRoutes');
const comparisionRoutes = require('./Routes/ComparisonRoutes');
const platformRoutes = require('./Routes/platformRoutes');
const sharingRoutes = require('./Routes/SharingRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'chrome-extension://*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comparisions', comparisionRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/sharing', sharingRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});