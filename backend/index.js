require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all routers
const UserRouter = require('./routers/UserRouters');
const ProductRouter = require('./routers/ProductRoutes');
const ComparisonRouter = require('./routers/ComparisonRoutes');
const PlatformRouter = require('./routers/PlatformRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routers
app.use('/user', UserRouter);
app.use('/product', ProductRouter);
app.use('/comparison', ComparisonRouter);
app.use('/platform', PlatformRouter);

// Base endpoint
app.get('/', (req, res) => {
    res.send('Response from Express');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});