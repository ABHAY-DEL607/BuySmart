require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const connectDB = require('./connection');

// Import all routers
const authRoutes = require('./Routes/authRoutes');
const priceRoutes = require('./Routes/priceRoutes');
const { default: mongoose } = require('mongoose');

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
// connectDB();
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err)); 

// Routers
app.use('/auth', authRoutes);
app.use('/prices', priceRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Base endpoint
app.get('/', (req, res) => {
    res.send('BuySmart API is running');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});