const puppeteer = require('puppeteer');

async function scrapeJioMart(url, searchQuery) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Navigate to the product URL or search URL
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // If productUrl is provided, scrape the exact product page
        if (url.includes('/product/')) {
            const product = await page.evaluate(() => {
                const titleElement = document.querySelector('.product-name');
                const priceElement = document.querySelector('.product-price');
                const imageElement = document.querySelector('.product-image img');
                const ratingElement = document.querySelector('.product-rating');
                const reviewsElement = document.querySelector('.product-reviews');
                const deliveryElement = document.querySelector('.delivery-info');
                
                const productUrl = window.location.href;
                const productId = productUrl.match(/\/product\/([^/]+)/)?.[1] || '';

                const priceText = priceElement?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                const ratingText = ratingElement?.textContent || '';
                const rating = parseFloat(ratingText) || 0;

                const reviewsText = reviewsElement?.textContent || '';
                const reviews = parseInt(reviewsText.match(/(\d+)/)?.[1] || '0') || 0;

                const deliveryText = deliveryElement?.textContent || '';
                const deliveryInfo = deliveryText.trim();

                const outOfStockElement = document.querySelector('.out-of-stock');
                const inStock = !outOfStockElement;

                return {
                    id: productId,
                    name: titleElement?.textContent?.trim() || '',
                    price: price,
                    image: imageElement?.src || '',
                    rating: rating,
                    reviews: reviews,
                    url: productUrl,
                    delivery: deliveryInfo,
                    inStock: inStock,
                    source: 'JioMart'
                };
            });
            return [product];
        }
        
        // Otherwise, scrape search results
        await page.waitForSelector('.product-card', { timeout: 5000 });

        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('.product-card');
            return Array.from(items).map(item => {
                try {
                    const titleElement = item.querySelector('.product-name');
                    const priceElement = item.querySelector('.product-price');
                    const imageElement = item.querySelector('.product-image img');
                    const ratingElement = item.querySelector('.product-rating');
                    const reviewsElement = item.querySelector('.product-reviews');
                    const linkElement = item.querySelector('a.product-link');
                    
                    const productUrl = linkElement?.href || '';
                    const productId = productUrl.match(/\/product\/([^/]+)/)?.[1] || '';

                    const priceText = priceElement?.textContent || '';
                    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                    const ratingText = ratingElement?.textContent || '';
                    const rating = parseFloat(ratingText) || 0;

                    const reviewsText = reviewsElement?.textContent || '';
                    const reviews = parseInt(reviewsText.match(/(\d+)/)?.[1] || '0') || 0;

                    const outOfStockElement = item.querySelector('.out-of-stock');
                    const inStock = !outOfStockElement;

                    return {
                        id: productId,
                        name: titleElement?.textContent?.trim() || '',
                        price: price,
                        image: imageElement?.src || '',
                        rating: rating,
                        reviews: reviews,
                        url: productUrl,
                        inStock: inStock,
                        source: 'JioMart'
                    };
                } catch (error) {
                    console.error('Error parsing product:', error);
                    return null;
                }
            }).filter(p => p && p.price >= 100);
        });

        if (searchQuery) {
            const q = searchQuery.trim().toLowerCase();
            const mainWords = q.split(/\s+/).filter(w => w.length > 1);
            const accessoryKeywords = ['case', 'cover', 'charger', 'cable', 'screen protector', 'tempered', 'glass', 'protector', 'adapter', 'battery', 'skin', 'pouch', 'stand', 'mount', 'holder', 'strap', 'dock', 'earbuds', 'earphones', 'headphones', 'wireless', 'bluetooth', 'sim', 'tool', 'stylus', 'pen', 'remote', 'tripod', 'selfie', 'ring', 'keychain', 'cleaner', 'kit', 'combo', 'bundle', 'set', 'replacement', 'accessory', 'accessories'];
            const isAccessory = (name) => accessoryKeywords.some(kw => name.includes(kw));
            const isMainMatch = (name) => mainWords.every(w => name.includes(w));
            const bestMatch = products.find(p => {
                if (!p.name) return false;
                const name = p.name.toLowerCase();
                return isMainMatch(name) && !isAccessory(name);
            });
            return bestMatch ? [bestMatch] : [];
        }
        return products;
    } catch (error) {
        console.error('Error scraping JioMart:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeJioMart }; 