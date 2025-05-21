require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { scrapeAmazon } = require('./scrapers/amazon');
const { scrapeFlipkart } = require('./scrapers/flipkart');
const { scrapePaytmMall } = require('./scrapers/paytmmall');
const { scrapeJioMart } = require('./scrapers/jiomart');
const { scrapeEbay } = require('./scrapers/ebay');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const User = require('./models/Users');
const bcrypt = require('bcrypt');
const productPriceRouter = require('./Routes/productPriceRouter');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    // Create test user if it doesn't exist
    try {
      const testUser = await User.findOne({ username: 'testuser' });
      if (!testUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword
        });
        console.log('Test user created successfully');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
    points: 10, // Number of requests
    duration: 1, // Per second
});

// Middleware
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use('/auth', authRoutes);
app.use('/api/prices', productPriceRouter);

// Rate limiting middleware
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (error) {
        res.status(429).json({ error: 'Too many requests, please try again later' });
    }
};

// Scraping routes
app.post('/api/scrape/:site', rateLimiterMiddleware, async (req, res) => {
    const { site } = req.params;
    const { query, url, productUrl } = req.body;

    try {
        let products = [];
        switch (site) {
            case 'amazon':
                products = await scrapeAmazon(productUrl || url, query);
                break;
            case 'flipkart':
                products = await scrapeFlipkart(productUrl || url, query);
                break;
            case 'paytmmall':
                products = await scrapePaytmMall(productUrl || url, query);
                break;
            case 'jiomart':
                products = await scrapeJioMart(productUrl || url, query);
                break;
            case 'ebay':
                products = await scrapeEbay(productUrl || url, query);
                break;
            default:
                return res.status(400).json({ error: 'Invalid site' });
        }
        res.json(products);
    } catch (error) {
        console.error(`Error scraping ${site}:`, error);
        res.status(500).json({ error: `Failed to scrape ${site}` });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});