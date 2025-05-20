(function () {
    // Ensure chrome.runtime is defined and accessible
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
        return; // Silently exit if not in Chrome extension context
    }

    // Check for token in website localStorage and send to background script
    function syncTokenToExtension() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                console.log('Found token in website localStorage, syncing to extension');
                chrome.runtime.sendMessage({
                    action: "setToken",
                    token: token,
                    source: 'website_localStorage'
                }, (response) => {
                    if (response && response.success) {
                        console.log('Successfully synced token to extension');
                    }
                });
                return true;
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
        }
        return false;
    }

    // Run token sync when script loads
    syncTokenToExtension();

    const supportedSites = [
        {
            domain: "amazon.in",
            name: "Amazon",
            productNameSelector: "#productTitle, #title, h1.a-size-large, span.a-size-large",
            productPriceSelector: "span.a-price-whole, span.a-price, span.a-offscreen, span.a-color-price",
            imageSelector: "img#landingImage, img[data-image-latency='s-product-image']",
            ratingSelector: "span.a-icon-alt, i.a-icon-star, span[data-cy='rating-recipe']",
            discountSelector: "span.a-size-large.a-color-price, span.a-color-success"
        },
        {
            domain: "flipkart.com",
            name: "Flipkart",
            productNameSelector: "span.B_NuCI, h1._2I9KP_, div._2WkVRV, div._3pLy-c div._4rR01T",
            productPriceSelector: "div._30jeq3._16Jk6d, div._1_WHN1, div._16Jk6d, div._3pLy-c div._30jeq3",
            imageSelector: "img._396cs4, img._2r_T1I, img._3exPp9, img._2QcLo1",
            ratingSelector: "div._3LWZlK, span._2I9KP_, div._1lRcqv, div._3pLy-c div._3LWZlK",
            discountSelector: "div._3Ay6Sb, div._3lqQdw, div._3pLy-c div._3Ay6Sb"
        },
        {
            domain: "paytmmall.com",
            name: "Paytm Mall",
            productNameSelector: "h1.NZJI, div._2apC, div[class*='name'], div[class*='title'], div._3WhJ div[class*='name']",
            productPriceSelector: "span._1V3w, span._1kMS, div[class*='price'], div._3WhJ div[class*='price']",
            imageSelector: "img._3togXc, img[class*='product'], img._1kMS, img._3WhJ img",
            ratingSelector: "div._1lRcqv, div[class*='rating'], div._3WhJ div[class*='rating']",
            discountSelector: "div._3DWFGc, div[class*='discount'], div._3WhJ div[class*='discount']"
        },
        {
            domain: "jiomart.com",
            name: "JioMart",
            productNameSelector: "h1.title, div.product-name, div[class*='name'], div[class*='title'], div.product-card div[class*='name']",
            productPriceSelector: "div.price-box span.final-price, div[class*='price'], span.final-price, div.product-card div[class*='price']",
            imageSelector: "img.product-image, img[class*='product'], img.lazy, div.product-card img",
            ratingSelector: "div.rating-box, div[class*='rating'], div.product-card div[class*='rating']",
            discountSelector: "div.discount-label, div[class*='discount'], div.product-card div[class*='discount']"
        },
        {
            domain: "ebay.com",
            name: "eBay",
            productNameSelector: "h1.x-item-title__mainTitle",
            productPriceSelector: "span.x-price-primary",
            imageSelector: "img.s-item__image-img",
            ratingSelector: "div.x-star-rating",
            discountSelector: "div.s-item__discount"
        }
    ];

    function getProductData() {
        const url = window.location.href;
        const site = supportedSites.find(s => url.includes(s.domain));
        if (!site) return null;

        try {
            // Helper functions to try multiple selectors
            const getText = (selectors) => {
                if (typeof selectors === 'string') selectors = [selectors];
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        const text = element.textContent.trim();
                        if (text) {
                            // Clean up the text
                            return text.replace(/\s+/g, ' ').trim();
                        }
                    }
                }
                return null;
            };

            const getImage = (selectors) => {
                if (typeof selectors === 'string') selectors = [selectors];
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        if (element.src) {
                            return element.src;
                        }
                    }
                }
                return null;
            };

            // Try to get product data using the defined selectors
            let productName = getText(site.productNameSelector);
            let productPrice = getText(site.productPriceSelector);
            let productImage = getImage(site.imageSelector);
            let rating = getText(site.ratingSelector);
            let discount = getText(site.discountSelector);

            // Additional fallback logic for specific sites
            if (!productName || !productPrice) {
                // Try to find any text that looks like a product name
                const possibleNames = document.querySelectorAll('h1, h2, h3, div[class*="title"], div[class*="name"]');
                for (const el of possibleNames) {
                    const text = el.textContent.trim();
                    if (text && text.length > 5 && text.length < 200) {
                        productName = text;
                        break;
                    }
                }

                // Try to find any text that looks like a price
                const possiblePrices = document.querySelectorAll('div[class*="price"], span[class*="price"], div[class*="amount"]');
                for (const el of possiblePrices) {
                    const text = el.textContent.trim();
                    if (text && (text.includes('₹') || /^\d/.test(text))) {
                        productPrice = text;
                        break;
                    }
                }
            }

            // Clean up price text
            if (productPrice) {
                productPrice = productPrice.replace(/[^\d.]/g, '').trim();
            }

            // If still no product name or price, try additional site-specific logic
            if (!productName || !productPrice) {
                if (site.domain === 'amazon.in') {
                    // Additional Amazon-specific selectors
                    productName = getText(['#productTitle', '#title', 'h1.a-size-large', 'span.a-size-large', 'div#titleSection']);
                    productPrice = getText(['span.a-price-whole', 'span.a-price', 'span.a-offscreen', 'span.a-color-price', 'div#price']);
                    productImage = getImage(['img#landingImage', 'img[data-image-latency="s-product-image"]', 'img#imgBlkFront']);
                    rating = getText(['span.a-icon-alt', 'i.a-icon-star', 'span[data-cy="rating-recipe"]', 'div#acrPopover']);
                    discount = getText(['span.a-size-large.a-color-price', 'span.a-color-success', 'div#priceblock_dealprice']);
                } else if (site.domain === 'flipkart.com') {
                    // Additional Flipkart-specific selectors
                    productName = getText(['span.B_NuCI', 'h1._2I9KP_', 'div._2WkVRV', 'div._3pLy-c div._4rR01T', 'div._1AtVbE']);
                    productPrice = getText(['div._30jeq3._16Jk6d', 'div._1_WHN1', 'div._16Jk6d', 'div._3pLy-c div._30jeq3', 'div._1vC4OE']);
                    productImage = getImage(['img._396cs4', 'img._2r_T1I', 'img._3exPp9', 'img._2QcLo1', 'img._1Nyybr']);
                    rating = getText(['div._3LWZlK', 'span._2I9KP_', 'div._1lRcqv', 'div._3pLy-c div._3LWZlK', 'div._1i0wkp']);
                    discount = getText(['div._3Ay6Sb', 'div._3lqQdw', 'div._3pLy-c div._3Ay6Sb', 'div._1V_ZGU']);
                } else if (site.domain === 'paytmmall.com') {
                    // Additional PaytmMall-specific selectors
                    productName = getText(['h1.NZJI', 'div._2apC', 'div[class*="name"]', 'div[class*="title"]', 'div._3WhJ div[class*="name"]']);
                    productPrice = getText(['span._1V3w', 'span._1kMS', 'div[class*="price"]', 'div._3WhJ div[class*="price"]', 'div._1V3w']);
                    productImage = getImage(['img._3togXc', 'img[class*="product"]', 'img._1kMS', 'img._3WhJ img', 'img._1Nyybr']);
                    rating = getText(['div._1lRcqv', 'div[class*="rating"]', 'div._3WhJ div[class*="rating"]', 'div._1i0wkp']);
                    discount = getText(['div._3DWFGc', 'div[class*="discount"]', 'div._3WhJ div[class*="discount"]', 'div._1V_ZGU']);
                } else if (site.domain === 'jiomart.com') {
                    // Additional JioMart-specific selectors
                    productName = getText(['h1.title', 'div.product-name', 'div[class*="name"]', 'div[class*="title"]', 'div.product-card div[class*="name"]']);
                    productPrice = getText(['div.price-box span.final-price', 'div[class*="price"]', 'span.final-price', 'div.product-card div[class*="price"]']);
                    productImage = getImage(['img.product-image', 'img[class*="product"]', 'img.lazy', 'div.product-card img', 'img.product-photo']);
                    rating = getText(['div.rating-box', 'div[class*="rating"]', 'div.product-card div[class*="rating"]', 'div.rating']);
                    discount = getText(['div.discount-label', 'div[class*="discount"]', 'div.product-card div[class*="discount"]', 'div.discount']);
                }
            }

            // If still no product name or price, return null
            if (!productName || !productPrice) {
                console.log('No valid product data found');
                return null;
            }

            console.log('Extracted product data:', {
                name: productName,
                price: productPrice,
                site: site.name,
                image: productImage || '',
                rating: rating || '',
                discount: discount || ''
            });

            return {
                name: productName,
                price: productPrice,
                site: site.name,
                image: productImage || '',
                rating: rating || '',
                discount: discount || '',
                url
            };
        } catch (error) {
            console.error('Error extracting product data:', error);
            return null;
        }
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "getProductData") {
            const productData = getProductData();
            sendResponse({ data: productData });
        } else if (request.action === "checkLocalToken") {
            try {
                const token = localStorage.getItem('token');
                sendResponse({ token: token });
            } catch (error) {
                console.error('Error checking localStorage:', error);
                sendResponse({ error: error.message });
            }
            return true;
        }
        return true;
    });

    const data = getProductData();
    if (data) {
        chrome.runtime.sendMessage({ action: "productData", data });
    }

    // Monitor localStorage changes for token updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'token' && e.newValue) {
            console.log('Token changed in localStorage, syncing to extension');
            chrome.runtime.sendMessage({
                action: "setToken",
                token: e.newValue,
                source: 'localStorage_event'
            });
        } else if (e.key === 'token' && !e.newValue) {
            console.log('Token removed from localStorage');
            chrome.runtime.sendMessage({
                action: "removeToken"
            });
        }
    });

    // Enhanced login detection for all sites
    // Track common login/signup/auth components
    const loginIndicators = [
        'login-success',
        'signup-success',
        'auth-success',
        'logged-in',
        'welcome-back',
        'account-menu',
        'user-profile',
        'user-name',
        'logout-button',
        'user-avatar'
    ];

    // Set up mutation observer to detect login state changes
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // Check if any of the new nodes or their children match login indicators
                if (mutation.addedNodes.length > 0) {
                    const hasLoginIndicator = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check the node itself
                            for (const indicator of loginIndicators) {
                                if (node.id?.includes(indicator) || 
                                    node.className?.includes(indicator) ||
                                    node.textContent?.toLowerCase().includes('welcome') ||
                                    node.textContent?.toLowerCase().includes('logged in')) {
                                    return true;
                                }
                            }
                            
                            // Check auth-related items within this node
                            const potentialAuthElements = node.querySelectorAll('button, a, div, span');
                            for (const el of potentialAuthElements) {
                                if (el.textContent?.toLowerCase().includes('log out') || 
                                    el.textContent?.toLowerCase().includes('sign out') || 
                                    el.textContent?.toLowerCase().includes('welcome')) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                    
                    if (hasLoginIndicator) {
                        console.log('Login state change detected in DOM');
                        if (syncTokenToExtension()) {
                            console.log('Successfully synced token after login detection');
                        }
                    }
                }
            }
        }
    });

    // Start observing the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
    });
    
    // Check for login state periodically (helpful for SPAs)
    function setupTokenPolling() {
        // For all pages, check occasionally if auth state changed
        const tokenCheckInterval = setInterval(() => {
            syncTokenToExtension();
        }, 5000); // every 5 seconds
        
        // Cleanup after 3 minutes to avoid unnecessary polling
        setTimeout(() => {
            clearInterval(tokenCheckInterval);
            console.log('Stopped token polling after timeout');
        }, 180000); // 3 minutes
    }
    
    // Start token polling
    setupTokenPolling();
})();