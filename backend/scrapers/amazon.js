const puppeteer = require('puppeteer');

async function scrapeAmazon(url, searchQuery) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set viewport to a common desktop resolution
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Enable request interception to block unnecessary resources
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                request.continue();
            } else {
                request.continue();
            }
        });

        // Navigate to the product URL or search URL
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // If productUrl is provided, scrape the exact product page
        if (url.includes('/dp/')) {
            const product = await page.evaluate(() => {
                const titleElement = document.querySelector('#productTitle');
                const priceElement = document.querySelector('.a-price .a-offscreen, .a-price-whole');
                const imageElement = document.querySelector('#landingImage');
                const ratingElement = document.querySelector('.a-icon-star-small, .a-icon-star');
                const reviewsElement = document.querySelector('.a-size-small .a-link-normal, .a-size-base.s-underline-text');
                const deliveryElement = document.querySelector('.a-row.a-size-small .a-color-base');
                
                const productUrl = window.location.href;
                const productId = productUrl.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || '';

                const priceText = priceElement?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                const ratingText = ratingElement?.textContent || '';
                const rating = parseFloat(ratingText.match(/(\d+(\.\d+)?)/)?.[1] || '0') || 0;

                const reviewsText = reviewsElement?.textContent || '';
                const reviews = parseInt(reviewsText.replace(/[^0-9]/g, '')) || 0;

                const deliveryText = deliveryElement?.textContent || '';
                const deliveryInfo = deliveryText.trim();

                const outOfStockElement = document.querySelector('.a-color-price');
                const isOutOfStock = outOfStockElement?.textContent?.includes('out of stock') || false;

                return {
                    id: productId,
                    name: titleElement?.textContent?.trim() || '',
                    price: price,
                    image: imageElement?.src || '',
                    rating: rating,
                    reviews: reviews,
                    url: productUrl,
                    delivery: deliveryInfo,
                    inStock: !isOutOfStock,
                    source: 'Amazon'
                };
            });
            return [product];
        }
        
        // Otherwise, scrape search results
        await page.waitForSelector('[data-component-type="s-search-result"]', { 
            timeout: 10000,
            visible: true 
        });

        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('[data-component-type="s-search-result"]');
            return Array.from(items).map(item => {
                try {
                    const titleElement = item.querySelector('h2 a span, .a-size-medium.a-color-base.a-text-normal');
                    const priceElement = item.querySelector('.a-price .a-offscreen, .a-price-whole');
                    const imageElement = item.querySelector('.s-image');
                    const ratingElement = item.querySelector('.a-icon-star-small, .a-icon-star');
                    const reviewsElement = item.querySelector('.a-size-small .a-link-normal, .a-size-base.s-underline-text');
                    const linkElement = item.querySelector('h2 a');
                    const deliveryElement = item.querySelector('.a-row.a-size-small .a-color-base');
                    
                    const productUrl = linkElement?.href || '';
                    const productId = productUrl.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || '';

                    const priceText = priceElement?.textContent || '';
                    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                    const ratingText = ratingElement?.textContent || '';
                    const rating = parseFloat(ratingText.match(/(\d+(\.\d+)?)/)?.[1] || '0') || 0;

                    const reviewsText = reviewsElement?.textContent || '';
                    const reviews = parseInt(reviewsText.replace(/[^0-9]/g, '')) || 0;

                    const deliveryText = deliveryElement?.textContent || '';
                    const deliveryInfo = deliveryText.trim();

                    const outOfStockElement = item.querySelector('.a-color-price');
                    const isOutOfStock = outOfStockElement?.textContent?.includes('out of stock') || false;

                    return {
                        id: productId,
                        name: titleElement?.textContent?.trim() || '',
                        price: price,
                        image: imageElement?.src || '',
                        rating: rating,
                        reviews: reviews,
                        url: productUrl,
                        delivery: deliveryInfo,
                        inStock: !isOutOfStock,
                        source: 'Amazon'
                    };
                } catch (error) {
                    console.error('Error parsing product:', error);
                    return null;
                }
            }).filter(p => p && p.price >= 100);
        });

        products.sort((a, b) => a.price - b.price);

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
        console.error('Error scraping Amazon:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeAmazon }; 