const supportedSites = [
    {
        domain: "amazon.in",
        name: "Amazon",
        productNameSelector: "#productTitle, #title, h1.a-size-large, span.a-size-large",
        productPriceSelector: "span.a-price-whole, span.a-price, span.a-offscreen, span.a-color-price",
        searchUrl: "https://www.amazon.in/s?k={query}",
        searchResultsContainer: "div.s-result-item.s-asin, div[data-component-type='s-search-result']",
        titleSelector: "span.a-size-medium, h2 a span, div[data-cy='title-recipe']",
        priceSelector: "span.a-price-whole, span.a-price, span.a-offscreen, span.a-color-price",
        imageSelector: "img.s-image, img[data-image-latency='s-product-image']",
        ratingSelector: "span.a-icon-alt, i.a-icon-star, span[data-cy='rating-recipe']",
        discountSelector: "span.a-size-large.a-color-price, span.a-color-success"
    },
    {
        domain: "flipkart.com",
        name: "Flipkart",
        productNameSelector: "span.B_NuCI, h1._2I9KP_, div._2WkVRV, div._3pLy-c div._4rR01T",
        productPriceSelector: "div._30jeq3._16Jk6d, div._1_WHN1, div._16Jk6d, div._3pLy-c div._30jeq3",
        searchUrl: "https://www.flipkart.com/search?q={query}",
        searchResultsContainer: "div.cPHDOP",
        titleSelector: "div.KzDlHZ",
        priceSelector: "div.Nx9bqj",
        imageSelector: "img.DByuf4",
        ratingSelector: "div.XQDdHH",
        discountSelector: "div.UkUFwK"
    },
    {
        domain: "paytmmall.com",
        name: "Paytm Mall",
        productNameSelector: "h1.NZJI, div._2apC, div[class*='name'], div[class*='title'], div._3WhJ div[class*='name']",
        productPriceSelector: "span._1V3w, span._1kMS, div[class*='price'], div._3WhJ div[class*='price'], div._1V3w",
        searchUrl: "https://paytmmall.com/shop/search?q={query}",
        searchResultsContainer: "div._3WhJ, div.UGUy, div[class*='product'], div._1fje, div._2i1r",
        titleSelector: "div._2apC, div[class*='name'], div[class*='title'], div._3WhJ div[class*='name']",
        priceSelector: "span._1kMS, span._1V3w, div[class*='price'], div._3WhJ div[class*='price']",
        imageSelector: "img._3togXc, img[class*='product'], img._1kMS, img._3WhJ img, img._1Nyybr",
        ratingSelector: "div._1lRcqv, div[class*='rating'], div._3WhJ div[class*='rating'], div._1i0wkp",
        discountSelector: "div._3DWFGc, div[class*='discount'], div._3WhJ div[class*='discount'], div._1V_ZGU"
    },
    {
        domain: "jiomart.com",
        name: "JioMart",
        productNameSelector: "div.plp-card-details-name",
        productPriceSelector: "span.jm-heading-xxs",
        searchUrl: "https://www.jiomart.com/search/{query}",
        searchResultsContainer: "div.plp-card-container",
        titleSelector: "div.plp-card-details-name",
        priceSelector: "span.jm-heading-xxs",
        imageSelector: "img.lazyautosizes",
        ratingSelector: "span.jm-badge",
        discountSelector: "span.jm-badge"
    },
    {
        domain: "ebay.com",
        name: "eBay",
        productNameSelector: "h1.x-item-title__mainTitle",
        productPriceSelector: "span.x-price-primary",
        searchUrl: "https://www.ebay.com/sch/i.html?_nkw={query}",
        searchResultsContainer: "div.s-item__wrapper",
        titleSelector: "div.s-item__title",
        priceSelector: "span.s-item__price",
        imageSelector: "img.s-item__image-img",
        ratingSelector: "div.x-star-rating",
        discountSelector: "div.s-item__discount"
    }
];

// Token Management Functions
const TokenManager = {
    // Set token in both localStorage and chrome.storage
    setToken(token, source = 'direct') {
        console.log(`Setting token from source: ${source}`);
        if (!token) {
            console.error("Cannot set empty token");
            return Promise.reject("Empty token");
        }
        
        return new Promise((resolve) => {
            // Set in chrome.storage.local
            chrome.storage.local.set({ 
                token: token, 
                isAuthenticated: true,
                loginTime: Date.now(),
                tokenSource: source
            }, () => {
                // Try to set in localStorage via content script if possible
                this.syncToLocalStorage(token)
                    .then(() => {
                        // Broadcast auth success to all extension contexts
                        chrome.runtime.sendMessage({ 
                            action: "auth_success", 
                            token: token 
                        }).catch(() => {
                            // Ignore errors from no listeners
                        });
                        resolve(true);
                    })
                    .catch(() => resolve(true)); // Resolve even if localStorage sync fails
            });
        });
    },

    // Remove token from both storages
    removeToken() {
        console.log("Removing auth token");
        return new Promise((resolve) => {
            chrome.storage.local.remove(["token", "isAuthenticated", "user", "loginTime", "tokenSource"], () => {
                this.removeFromLocalStorage()
                    .then(() => {
                        // Broadcast auth removed to all extension contexts
                        chrome.runtime.sendMessage({ 
                            action: "auth_removed" 
                        }).catch(() => {
                            // Ignore errors from no listeners
                        });
                        resolve(true);
                    })
                    .catch(() => resolve(true)); // Resolve even if localStorage removal fails
            });
        });
    },

    // Get token from storage
    getToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['token'], (result) => {
                resolve(result.token || null);
            });
        });
    },

    // Check if user is authenticated
    isAuthenticated() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['token', 'isAuthenticated'], (result) => {
                resolve(!!(result.token && result.isAuthenticated));
            });
        });
    },

    // Sync token to localStorage via content script
    syncToLocalStorage(token) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                if (!tabs || !tabs.length) {
                    reject("No active tabs found");
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (token) => { 
                        try {
                            window.localStorage.setItem('token', token);
                            console.log("Token stored in localStorage");
                            return true;
                        } catch (e) {
                            console.error("Couldn't access localStorage", e);
                            return false;
                        }
                    },
                    args: [token]
                })
                .then(results => {
                    if (results && results[0] && results[0].result) {
                        resolve(true);
                    } else {
                        reject("Failed to set localStorage");
                    }
                })
                .catch(reject);
            });
        });
    },

    // Remove token from localStorage via content script
    removeFromLocalStorage() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                if (!tabs || !tabs.length) {
                    reject("No active tabs found");
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => { 
                        try {
                            window.localStorage.removeItem('token');
                            console.log("Token removed from localStorage");
                            return true;
                        } catch (e) {
                            console.error("Couldn't access localStorage", e);
                            return false;
                        }
                    }
                })
                .then(results => {
                    if (results && results[0] && results[0].result) {
                        resolve(true);
                    } else {
                        reject("Failed to remove from localStorage");
                    }
                })
                .catch(reject);
            });
        });
    },
    
    // Check for token in all tabs
    // checkAllTabsForToken() {
    //     console.log("Checking all tabs for tokens");
        
    //     // Get all tabs that match our supported websites
    //     const urlPatterns = supportedSites.map(site => `*://*.${site.domain}/*`);
    //     urlPatterns.push("http://localhost:3000/*");  // Add login website
        
    //     chrome.tabs.query({ url: urlPatterns }, (tabs) => {
    //         if (!tabs || tabs.length === 0) {
    //             console.log("No relevant tabs found to check for tokens");
    //             return;
    //         }
            
    //         console.log(`Found ${tabs.length} tabs to check for tokens`);
            
    //         // Check each tab for localStorage token
    //         tabs.forEach(tab => {
    //             chrome.scripting.executeScript({
    //                 target: { tabId: tab.id },
    //                 func: () => {
    //                     try {
    //                         return localStorage.getItem('token');
    //                     } catch (e) {
    //                         console.error("Couldn't access localStorage in tab", e);
    //                         return null;
    //                     }
    //                 }
    //             }).then(results => {
    //                 if (results && results[0] && results[0].result) {
    //                     console.log(`Found token in tab ${tab.id}: ${tab.url}`);
    //                     this.setToken(results[0].result, 'tab_discovery');
    //                 }
    //             }).catch(error => {
    //                 console.error(`Error checking tab ${tab.id}:`, error);
    //             });
    //         });
    //     });
    // }
};

// Register the sidepanel
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("Failed to set panel behavior:", error));

// This should run when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("BuySmart extension installed or updated");
    
    // Check for existing token in chrome storage
    chrome.storage.local.get(['token'], (result) => {
        if (result.token) {
            console.log("Found existing token in chrome.storage");
            TokenManager.syncToLocalStorage(result.token)
                .then(() => console.log("Synced existing token to localStorage"))
                .catch(err => console.log("Could not sync token to localStorage:", err));
        } 
        // else {
        //     // No token in storage, check all tabs
        //     TokenManager.checkAllTabsForToken();
        // }
    });
});

// This function was previously empty, now we properly implement it
// function checkAllTabsForToken() {
//     TokenManager.checkAllTabsForToken();
// }

// // Check for tokens periodically
// setInterval(checkAllTabsForToken, 30000); // every 30 seconds

// // Run a check when a new tab is created or updated
// chrome.tabs.onCreated.addListener(() => {
//     setTimeout(checkAllTabsForToken, 3000); // Delay to allow page to load
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
        setTimeout(() => {
            // Only check the updated tab
            chrome.tabs.get(tabId, (tab) => {
                // Check if this tab is for our website
                if (tab.url && (tab.url.includes("localhost:3000") || 
                    supportedSites.some(site => tab.url.includes(site.domain)))) {
                    chrome.scripting.executeScript({
                        target: { tabId },
                        func: () => {
                            try {
                                return localStorage.getItem('token');
                            } catch (e) {
                                return null;
                            }
                        }
                    }).then(results => {
                        if (results && results[0] && results[0].result) {
                            TokenManager.setToken(results[0].result, 'tab_updated');
                        }
                    }).catch(() => {
                        // Ignore errors for non-accessible tabs
                    });
                }
            });
        }, 1000);
    }
});

// Add debugging to track site access
function logSiteAccess(site, status, details = "") {
    console.log(`${site} access ${status}: ${details}`);
}

// Add this function to dump page content for debugging
async function dumpPageContent(tabId, site) {
    try {
        const result = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => document.documentElement.outerHTML
        });
        
        if (result && result[0]) {
            console.log(`Page content for ${site} (first 500 chars):`);
            console.log(result[0].result.substring(0, 500));
            return true;
        }
    } catch (e) {
        console.error(`Error dumping page for ${site}:`, e);
    }
    return false;
}

// Improved search function
async function searchProducts(query, productLink) {
    console.log('Searching products with query:', query, 'productLink:', productLink);
    
    // If a product link is provided, try to extract data from that specific site
    if (productLink) {
        const site = supportedSites.find(s => productLink.includes(s.domain));
        if (site) {
            try {
                const response = await fetch(productLink, { 
                    credentials: 'omit',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                const html = await response.text();
                
                // Create a temporary tab to process HTML
                const tab = await chrome.tabs.create({
                    url: "about:blank",
                    active: false
                });
                
                // Use the tab to extract the data using DOM APIs
                const extractionResult = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (html, selectors) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Try multiple selectors for each field
                        const getText = (selectors) => {
                            if (typeof selectors === 'string') selectors = [selectors];
                            for (const selector of selectors) {
                                const elements = doc.querySelectorAll(selector);
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
                                const elements = doc.querySelectorAll(selector);
                                for (const element of elements) {
                                    if (element.src) {
                                        return element.src;
                                    }
                                }
                            }
                            return null;
                        };

                        // Site-specific extraction logic
                        let name = getText(selectors.productNameSelector);
                        let price = getText(selectors.productPriceSelector);
                        let image = getImage(selectors.imageSelector);
                        let rating = getText(selectors.ratingSelector);
                        let discount = getText(selectors.discountSelector);

                        // Additional fallback logic for specific sites
                        if (!name || !price) {
                            // Try to find any text that looks like a product name
                            const possibleNames = doc.querySelectorAll('h1, h2, h3, div[class*="title"], div[class*="name"]');
                            for (const el of possibleNames) {
                                const text = el.textContent.trim();
                                if (text && text.length > 5 && text.length < 200) {
                                    name = text;
                                    break;
                                }
                            }

                            // Try to find any text that looks like a price
                            const possiblePrices = doc.querySelectorAll('div[class*="price"], span[class*="price"], div[class*="amount"]');
                            for (const el of possiblePrices) {
                                const text = el.textContent.trim();
                                if (text && (text.includes('₹') || /^\d/.test(text))) {
                                    price = text;
                                    break;
                                }
                            }
                        }

                        // Clean up price text
                        if (price) {
                            price = price.replace(/[^\d.]/g, '').trim();
                        }

                        return {
                            name: name || 'Unknown Product',
                            price: price || 'N/A',
                            image: image || '',
                            rating: rating || '',
                            discount: discount || ''
                        };
                    },
                    args: [html, {
                        productNameSelector: site.productNameSelector,
                        productPriceSelector: site.productPriceSelector,
                        imageSelector: site.imageSelector,
                        ratingSelector: site.ratingSelector,
                        discountSelector: site.discountSelector
                    }]
                });
                
                // Close the temporary tab
                chrome.tabs.remove(tab.id);
                
                if (!extractionResult || !extractionResult[0] || !extractionResult[0].result) {
                    return [];
                }
                
                const product = extractionResult[0].result;
                return [{
                    site: site.name,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    rating: product.rating,
                    discount: product.discount,
                    url: productLink
                }].filter(item => item.name && item.price !== 'N/A');
            } catch (error) {
                console.error(`Error fetching product from ${site.name}:`, error);
                return [];
            }
        }
    }
    
    // For general search, create tabs for each site and extract data
    try {
        const results = await Promise.all(supportedSites.map(async site => {
            const searchUrl = site.searchUrl.replace('{query}', encodeURIComponent(query));
            console.log(`Searching ${site.name} at ${searchUrl}`);
            
            try {
                const tab = await new Promise(resolve => {
                    chrome.tabs.create({ url: searchUrl, active: false }, tab => {
                        logSiteAccess(site.name, "tab created", `Tab ID: ${tab.id}`);
                        resolve(tab);
                    });
                });
                
                // Wait for the page to load
                await new Promise((resolve, reject) => {
                    let loadAttempts = 0;
                    const maxAttempts = 3;
                    
                    const checkPageLoaded = async () => {
                        loadAttempts++;
                        logSiteAccess(site.name, "checking load status", `Attempt ${loadAttempts}`);
                        
                        const success = await dumpPageContent(tab.id, site.name);
                        
                        if (success) {
                            logSiteAccess(site.name, "loaded successfully");
                            resolve();
                        } else if (loadAttempts >= maxAttempts) {
                            logSiteAccess(site.name, "failed to load after max attempts");
                            reject(new Error(`Failed to load ${site.name}`));
                        } else {
                            setTimeout(checkPageLoaded, 3000);
                        }
                    };
                    
                    setTimeout(checkPageLoaded, 3000);
                    
                    setTimeout(() => {
                        if (loadAttempts < maxAttempts) {
                            logSiteAccess(site.name, "global timeout reached");
                            resolve();
                        }
                    }, 15000);
                }).catch(err => {
                    console.error(`Load error for ${site.name}:`, err);
                });
                
                // Modified extraction with improved selectors
                const extractionResult = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (site) => {
                        console.log(`Extracting data from ${site.domain}...`);
                        
                        try {
                            // Try multiple selectors for each field
                            const getElements = (selectors) => {
                                if (typeof selectors === 'string') selectors = [selectors];
                                for (const selector of selectors) {
                                    const elements = document.querySelectorAll(selector);
                                    if (elements.length > 0) return elements;
                                }
                                return [];
                            };

                            const getText = (element, selectors) => {
                                if (typeof selectors === 'string') selectors = [selectors];
                                for (const selector of selectors) {
                                    const child = element.querySelector(selector);
                                    if (child?.textContent?.trim()) {
                                        return child.textContent.trim();
                                    }
                                }
                                return null;
                            };

                            const getImage = (element, selectors) => {
                                // 1. First try the regular selector approach
                                if (typeof selectors === 'string') selectors = [selectors];
                                for (const selector of selectors) {
                                    const child = element.querySelector(selector);
                                    if (child?.src) {
                                        return child.src;
                                    }
                                }
                                
                                // 2. Special case for eBay
                                if (site.domain === 'ebay.com') {
                                    // Look for image within s-item__image div
                                    const imageContainer = element.querySelector('div.s-item__image');
                                    if (imageContainer) {
                                        const img = imageContainer.querySelector('img');
                                        if (img?.src) {
                                            return img.src;
                                        }
                                    }
                                    
                                    // Fallback to any image in the item wrapper
                                    const anyImg = element.querySelector('img');
                                    if (anyImg?.src) {
                                        return anyImg.src;
                                    }
                                }
                                
                                // 3. General fallback - try to find any img tag
                                const imgs = element.querySelectorAll('img');
                                for (const img of imgs) {
                                    if (img.src && !img.src.includes('spacer.gif')) {
                                        return img.src;
                                    }
                                }
                                
                                return null;
                            };

                            const productElements = getElements(site.searchResultsContainer);
                            console.log(`Found ${productElements.length} elements for ${site.domain}`);

                            if (productElements.length > 0) {
                                return Array.from(productElements).slice(0, 5).map(el => {
                                    const title = getText(el, site.titleSelector);
                                    const price = getText(el, site.priceSelector);
                                    const image = getImage(el, site.imageSelector);
                                    const rating = getText(el, site.ratingSelector);
                                    const link = el.querySelector('a')?.href || window.location.href;

                                    // Additional fallback logic for specific sites
                                    if (!title || !price) {
                                        // Try to find any text that looks like a product name
                                        const possibleNames = el.querySelectorAll('h1, h2, h3, div[class*="title"], div[class*="name"]');
                                        for (const nameEl of possibleNames) {
                                            const text = nameEl.textContent.trim();
                                            if (text && text.length > 5 && text.length < 200) {
                                                title = text;
                                                break;
                                            }
                                        }

                                        // Try to find any text that looks like a price
                                        const possiblePrices = el.querySelectorAll('div[class*="price"], span[class*="price"], div[class*="amount"]');
                                        for (const priceEl of possiblePrices) {
                                            const text = priceEl.textContent.trim();
                                            if (text && (text.includes('₹') || /^\d/.test(text))) {
                                                price = text;
                                                break;
                                            }
                                        }
                                    }

                                    if (title && price) {
                                        console.log(`Found ${site.domain} product: ${title} - ${price}`);
                                        return {
                                            name: title,
                                            price: price,
                                            image: image || '',
                                            rating: rating || '',
                                            url: link
                                        };
                                    }
                                    return null;
                                }).filter(item => item !== null);
                            }
                            
                            console.log(`Couldn't extract products from ${site.domain}`);
                            return [];
                            
                        } catch (e) {
                            console.error(`Error extracting from ${site.domain}:`, e);
                            return [];
                        }
                    },
                    args: [site]
                });
                
                // Always close the tab
                try {
                    await chrome.tabs.remove(tab.id);
                    logSiteAccess(site.name, "tab closed");
                } catch (e) {
                    console.error(`Error closing tab for ${site.name}:`, e);
                }
                
                if (!extractionResult || !extractionResult[0] || !extractionResult[0].result) {
                    logSiteAccess(site.name, "no extraction results");
                    return [];
                }
                
                const extractedProducts = extractionResult[0].result;
                console.log(extractedProducts);
                
                logSiteAccess(site.name, `extracted ${extractedProducts.length} products`);
                
                return extractedProducts.map(product => ({
                    site: site.name,
                    ...product
                }));
            } catch (error) {
                console.error(`Error searching ${site.name}:`, error);
                logSiteAccess(site.name, "search error", error.message);
                return [];
            }
        }));
        
        const flatResults = results.flat();
        // Filter out products with 'Shop on eBay' in their names
        const filteredResults = flatResults.filter(product => 
            !product.name?.toLowerCase().includes('shop on ebay')
        );
        console.log(`Total results across all sites: ${filteredResults.length} (after filtering)`);
        return filteredResults;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// Updated price comparison function
async function fetchPricesFromOtherSites(productName, currentSite) {
    console.log(`Comparing prices for: ${productName}, current site: ${currentSite}`);
    
    const results = await Promise.all(
        supportedSites
            .filter(site => site.domain !== currentSite)
            .map(site => new Promise(resolve => {
                const searchUrl = site.searchUrl.replace("{query}", encodeURIComponent(productName));
                console.log(`Comparing on ${site.name} at ${searchUrl}`);
                
                chrome.tabs.create({ url: searchUrl, active: false }, tab => {
                    const tabId = tab.id;
                    
                    // Setup timeout handler
                    const timeout = setTimeout(() => {
                        try {
                            chrome.tabs.remove(tabId);
                            resolve({ 
                                site: site.name, 
                                price: 'Timeout', 
                                image: '' 
                            });
                        } catch (e) {}
                    }, 20000);
                    
                    // Wait longer before extracting data
                    setTimeout(() => {
                        try {
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: (siteDomain) => {
                                    try {
                                        console.log(`Processing ${siteDomain}`);
                                        
                                        // First try site-specific approaches
                                        if (siteDomain === 'flipkart.com') {
                                            // Check for product price
                                            const priceElements = document.querySelectorAll('div._30jeq3, div._30jeq3._1_WHN1');
                                            if (priceElements.length > 0) {
                                                const price = priceElements[0].textContent.trim();
                                                const imageElements = document.querySelectorAll('img._396cs4');
                                                console.log(`Found Flipkart price: ${price}`);
                                                return {
                                                    price: price,
                                                    image: imageElements.length > 0 ? imageElements[0].src : ''
                                                };
                                            }
                                        }
                                        else if (siteDomain === 'paytmmall.com') {
                                            // Try multiple approaches for Paytm Mall
                                            const priceElements = document.querySelectorAll('span._1kMS, span._1V3w, div[class*="price"]');
                                            if (priceElements.length > 0) {
                                                const price = priceElements[0].textContent.trim();
                                                console.log(`Found PaytmMall price: ${price}`);
                                                return {
                                                    price: price,
                                                    image: document.querySelector('img')?.src || ''
                                                };
                                            }
                                        }
                                        else if (siteDomain === 'jiomart.com') {
                                            // Try multiple approaches for JioMart
                                            const priceElements = document.querySelectorAll('span.final-price, div.price-box');
                                            if (priceElements.length > 0) {
                                                const price = priceElements[0].textContent.trim();
                                                console.log(`Found JioMart price: ${price}`);
                                                return {
                                                    price: price,
                                                    image: document.querySelector('img.product-image, img.lazy')?.src || ''
                                                };
                                            }
                                        }
                                        
                                        // Generic price finder as fallback
                                        const priceElements = document.querySelectorAll(
                                            '[class*="price"]:not(div), span.a-price-whole, div._30jeq3'
                                        );
                                        
                                        if (priceElements.length > 0) {
                                            for (const el of priceElements) {
                                                const text = el.textContent.trim();
                                                if (text.includes('₹') || text.includes('Rs') || /^\d/.test(text)) {
                                                    console.log(`Found generic price: ${text}`);
                                                    return {
                                                        price: text,
                                                        image: document.querySelector('img')?.src || ''
                                                    };
                                                }
                                            }
                                        }
                                        
                                        console.log(`No price found for ${siteDomain}`);
                                        return {
                                            price: 'Not Found',
                                            image: ''
                                        };
                                    } catch (e) {
                                        console.error(`Error in price extraction for ${siteDomain}:`, e);
                                    return {
                                            price: 'Error',
                                            image: ''
                                    };
                                    }
                                },
                                args: [site.domain]
                            }, (results) => {
                                clearTimeout(timeout); // Clear timeout once we have results
                                
                                try {
                                chrome.tabs.remove(tabId);
                                } catch (e) {}
                                
                                let result = { 
                                    site: site.name, 
                                    price: 'Not Found', 
                                    image: '' 
                                };
                                
                                if (!chrome.runtime.lastError && results && results[0] && results[0].result) {
                                    const data = results[0].result;
                                    result = {
                                        site: site.name,
                                        price: data.price,
                                        image: data.image
                                    };
                                    console.log(`Successfully got price from ${site.name}: ${data.price}`);
                                }
                                
                                resolve(result);
                            });
                        } catch (e) {
                            console.error(`Error during price comparison script execution for ${site.name}:`, e);
                            clearTimeout(timeout);
                            try { chrome.tabs.remove(tabId); } catch (e) {}
                            resolve({ site: site.name, price: 'Script Error', image: '' });
                        }
                    }, 5000); // 5 second wait
                });
            }))
    );
    
    console.log("All price comparison results:", results);
    return results;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);

    if (message.action === "setToken") {
        TokenManager.setToken(message.token, message.source || 'message')
            .then(() => {
                // Notification handled directly in TokenManager
                sendResponse({ success: true });
            })
            .catch((error) => {
                sendResponse({ success: false, error });
            });
        return true;
    }

    if (message.action === "removeToken") {
        TokenManager.removeToken()
            .then(() => {
                // Notification handled directly in TokenManager
                sendResponse({ success: true });
            })
            .catch((error) => {
                sendResponse({ success: false, error });
            });
        return true;
    }

    if (message.action === "getToken") {
        TokenManager.getToken().then(token => {
            sendResponse({ token });
        });
        return true;
    }

    if (message.action === "isAuthenticated") {
        TokenManager.isAuthenticated().then(isAuthenticated => {
            sendResponse({ isAuthenticated });
        });
        return true;
    }

    if (message.action === "openAuth") {
        chrome.tabs.create({
            url: message.url,
            active: true
        }, (tab) => {
            // Set up a listener to check when the user has completed authentication
            function checkForAuth() {
                TokenManager.isAuthenticated().then(isAuthenticated => {
                    if (isAuthenticated) {
                        TokenManager.getToken().then(token => {
                            chrome.runtime.sendMessage({ action: 'auth_success', token });
                            clearInterval(authCheckInterval);
                        });
                    }
                });
            }
            
            // Check every 2 seconds if auth is complete
            const authCheckInterval = setInterval(checkForAuth, 2000);
            
            // Clear interval after 10 minutes (safety precaution)
            setTimeout(() => clearInterval(authCheckInterval), 600000);
        });
        return true;
    }

    if (message.action === "getProductData") {
        chrome.storage.local.get(["productData"], (result) => {
            sendResponse({ data: result.productData || null });
        });
        return true;
    }

    if (message.action === "productData") {
        if (!message.data) {
            console.error("Received empty product data");
            sendResponse({ success: false });
            return true;
        }
        chrome.storage.local.set({ productData: message.data }, () => {
            console.log("Product data saved");
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.action === "searchProducts") {
        searchProducts(message.query, message.productLink)
            .then(results => sendResponse({ results }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }

    if (message.action === "comparePrices") {
        const { productName, site, productLink } = message.data || {};
        if (!productName && !productLink) {
            sendResponse({ error: "Product name or link required" });
            return true;
        }
        fetchPricesFromOtherSites(productName || 'product', site)
            .then(prices => sendResponse({ prices }))
            .catch(error => sendResponse({ error: error.message }));
        return true;
    }

    if (message.action === "getSupportedSites") {
        sendResponse({ supportedSites });
        return true;
    }
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (sender.url.startsWith("http://localhost:3000") && (message.type === 'LOGIN_SUCCESS' || message.type === 'SIGNUP_SUCCESS')) {
        if (message.token) {
            // Store token using TokenManager
            TokenManager.setToken(message.token, message.type)
                .then(() => {
                    sendResponse({ success: true });
                    
                    // Notify all extension contexts about successful auth
                    chrome.runtime.sendMessage({ 
                        action: "auth_success", 
                        token: message.token 
                    });
                })
                .catch(error => {
                    console.error("Error setting token:", error);
                    sendResponse({ success: false, error });
                });
                
            return true;
        }
    }
    sendResponse({ success: false, error: "Invalid message or origin" });
});