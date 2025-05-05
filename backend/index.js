require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import all routers
const authRoutes = require('./Routes/authRoutes');
const priceRoutes = require('./Routes/priceRoutes');
const feedbackRoutes = require('./Routes/FeedbackRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'chrome-extension://*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.log('MongoDB connection error:', err)); 

// Routers
app.use('/auth', authRoutes);
app.use('/prices', priceRoutes);
app.use('/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Base endpoint
app.get('/', (req, res) => {
    res.send('BuySmart API is running');
});

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Trying port ${port + 1}`);
        server.listen(port + 1);
    } else {
        console.error('Server error:', err);
    }
});