const puppeteer = require('puppeteer');

async function scrapeEbay(url, searchQuery) {
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
        if (url.includes('/itm/')) {
            const product = await page.evaluate(() => {
                const titleElement = document.querySelector('.x-item-title__mainTitle');
                const priceElement = document.querySelector('.x-price-primary');
                const imageElement = document.querySelector('.ux-image-carousel-item img');
                const ratingElement = document.querySelector('.x-star-rating');
                const reviewsElement = document.querySelector('.ux-seller-section__item--feedback');
                const deliveryElement = document.querySelector('.ux-labels-values__values-content');
                
                const productUrl = window.location.href;
                const productId = productUrl.match(/\/itm\/(\d+)/)?.[1] || '';

                const priceText = priceElement?.textContent || '';
                const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                const ratingText = ratingElement?.getAttribute('aria-label') || '';
                const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || '0') || 0;

                const reviewsText = reviewsElement?.textContent || '';
                const reviews = parseInt(reviewsText.match(/(\d+)/)?.[1] || '0') || 0;

                const deliveryText = deliveryElement?.textContent || '';
                const deliveryInfo = deliveryText.trim();

                const outOfStockElement = document.querySelector('.x-item-condition-text');
                const inStock = !outOfStockElement?.textContent?.toLowerCase().includes('sold');

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
                    source: 'eBay'
                };
            });
            return [product];
        }
        
        // Otherwise, scrape search results
        await page.waitForSelector('.s-item', { timeout: 5000 });

        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('.s-item');
            return Array.from(items).map(item => {
                try {
                    const titleElement = item.querySelector('.s-item__title');
                    const priceElement = item.querySelector('.s-item__price');
                    const imageElement = item.querySelector('.s-item__image-img');
                    const ratingElement = item.querySelector('.x-star-rating');
                    const reviewsElement = item.querySelector('.s-item__reviews-count');
                    const linkElement = item.querySelector('a.s-item__link');
                    
                    const productUrl = linkElement?.href || '';
                    const productId = productUrl.match(/\/itm\/(\d+)/)?.[1] || '';

                    const priceText = priceElement?.textContent || '';
                    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

                    const ratingText = ratingElement?.getAttribute('aria-label') || '';
                    const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || '0') || 0;

                    const reviewsText = reviewsElement?.textContent || '';
                    const reviews = parseInt(reviewsText.match(/(\d+)/)?.[1] || '0') || 0;

                    const outOfStockElement = item.querySelector('.s-item__availability');
                    const inStock = !outOfStockElement?.textContent?.toLowerCase().includes('sold');

                    return {
                        id: productId,
                        name: titleElement?.textContent?.trim() || '',
                        price: price,
                        image: imageElement?.src || '',
                        rating: rating,
                        reviews: reviews,
                        url: productUrl,
                        inStock: inStock,
                        source: 'eBay'
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
        console.error('Error scraping eBay:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeEbay }; 