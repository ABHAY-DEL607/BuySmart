const express = require('express');
const router = express.Router();
const ProductPrice = require('../models/ProductPriceModel');
const authMiddleware = require('../middleware/auth');

// Save a single product
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productName, currentSite, currentPrice, productImage, productUrl } = req.body;
        const userId = req.user.id;
        
        if (!productName || !currentSite || !currentPrice) {
            return res.status(400).json({ error: 'Missing required product information' });
        }
        
        const newProduct = await ProductPrice.create({
            userId,
            productName,
            currentSite,
            currentPrice,
            productImage: productImage || null,
            productUrl: productUrl || null,
            priceHistory: [{ price: currentPrice, date: new Date() }]
        });
        
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// Save multiple products in batch
router.post('/batch', async (req, res) => {
    try {
        const { products } = req.body;
        // const userId = req.user.id;
        
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid products data' });
        }
        
        // Save all products in a transaction
        const savedProducts = await Promise.all(products.map(product => {
            return ProductPrice.create({
                // userId,
                productName: product.productName,
                currentSite: product.currentSite,
                currentPrice: product.currentPrice,
                productImage: product.productImage || null,
                productUrl: product.productUrl || null,
                priceHistory: [{ price: product.currentPrice, date: new Date() }]
            });
        }));
        
        res.status(201).json({ success: true, count: savedProducts.length });
    } catch (error) {
        console.error('Error saving batch products:', error);
        res.status(500).json({ error: 'Failed to save products' });
    }
});

// Search products by name
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const products = await ProductPrice.find({
            productName: { $regex: q, $options: 'i' }
        }).sort({ timestamp: -1 });
        
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Get user's saved products
router.get('/', async (req, res) => {
    try {
        // const userId = req.user.id;
        const products = await ProductPrice.find()
            .sort({ timestamp: -1 });
            
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching saved products:', error);
        res.status(500).json({ error: 'Failed to fetch saved products' });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        // const userId = req.user.id;
        const productId = req.params.id;
        
        const product = await ProductPrice.findOne({
            _id: productId,
            // userId: userId
        });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

module.exports = router;