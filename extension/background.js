const supportedSites = [
    {
        domain: "amazon.in",
        name: "Amazon",
        productNameSelector: "#productTitle",
        productPriceSelector: "span.a-price-whole",
        searchUrl: "https://www.amazon.in/s?k={query}",
        searchResultsContainer: "div.s-result-item.s-asin",
        titleSelector: "span.a-size-medium",
        priceSelector: "span.a-price-whole",
        imageSelector: "img.s-image",
        ratingSelector: "span.a-icon-alt",
        discountSelector: "span.a-size-large.a-color-price"
    },
    {
        domain: "flipkart.com",
        name: "Flipkart",
        productNameSelector: "span.B_NuCI",
        productPriceSelector: "div._30jeq3._16Jk6d",
        searchUrl: "https://www.flipkart.com/search?q={query}",
        searchResultsContainer: "div._1AtVbE.col-12-12",
        titleSelector: "div._4rR01T",
        priceSelector: "div._30jeq3._1_WHN1",
        imageSelector: "img._396cs4",
        ratingSelector: "div._3LWZlK",
        discountSelector: "div._3Ay6Sb"
    },
    {
        domain: "paytmmall.com",
        name: "Paytm Mall",
        productNameSelector: "h1.NZJI",
        productPriceSelector: "span._1V3w",
        searchUrl: "https://paytmmall.com/shop/search?q={query}",
        searchResultsContainer: "div._3WhJ",
        titleSelector: "div._2apC",
        priceSelector: "span._1kMS",
        imageSelector: "img._3togXc",
        ratingSelector: "div._1lRcqv",
        discountSelector: "div._3DWFGc"
    },
    {
        domain: "jiomart.com",
        name: "JioMart",
        productNameSelector: "h1.title",
        productPriceSelector: "div.price-box span.final-price",
        searchUrl: "https://www.jiomart.com/search/{query}",
        searchResultsContainer: "div.product-item",
        titleSelector: "div.product-name",
        priceSelector: "span.final-price",
        imageSelector: "img.product-image",
        ratingSelector: "div.rating-box",
        discountSelector: "div.discount-label"
    },
    {
        domain: "ebay.in",
        name: "eBay",
        productNameSelector: "h1.x-item-title__mainTitle",
        productPriceSelector: "span.x-price-primary",
        searchUrl: "https://www.ebay.in/sch/i.html?_nkw={query}",
        searchResultsContainer: "li.s-item",
        titleSelector: "div.s-item__title",
        priceSelector: "span.s-item__price",
        imageSelector: "img.s-item__image-img",
        ratingSelector: "div.x-star-rating",
        discountSelector: "div.s-item__discount"
    }
];

// Function to extract product data from the current page
function extractProductData() {
    const currentUrl = window.location.href;
    const currentSite = supportedSites.find(site => currentUrl.includes(site.domain));
    
    if (!currentSite) return null;

    try {
        const productName = document.querySelector(currentSite.productNameSelector)?.textContent.trim();
        const productPrice = document.querySelector(currentSite.productPriceSelector)?.textContent.trim();
        const productImage = document.querySelector(currentSite.imageSelector)?.src;
        const rating = document.querySelector(currentSite.ratingSelector)?.textContent.trim();
        const discount = document.querySelector(currentSite.discountSelector)?.textContent.trim();

        if (!productName || !productPrice) return null;

        return {
            site: currentSite.name,
            name: productName,
            price: productPrice,
            image: productImage,
            rating: rating,
            discount: discount,
            url: currentUrl
        };
    } catch (error) {
        console.error('Error extracting product data:', error);
        return null;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProductData") {
        const productData = extractProductData();
        sendResponse({ data: productData });
    }
});

// Function to search products across all sites
async function searchProducts(query) {
    const searchPromises = supportedSites.map(site => {
        const searchUrl = site.searchUrl.replace('{query}', encodeURIComponent(query));
        return fetch(searchUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const results = doc.querySelectorAll(site.searchResultsContainer);
                
                return Array.from(results).map(result => ({
                    site: site.name,
                    name: result.querySelector(site.titleSelector)?.textContent.trim(),
                    price: result.querySelector(site.priceSelector)?.textContent.trim(),
                    image: result.querySelector(site.imageSelector)?.src,
                    rating: result.querySelector(site.ratingSelector)?.textContent.trim(),
                    discount: result.querySelector(site.discountSelector)?.textContent.trim(),
                    url: result.querySelector('a')?.href
                })).filter(item => item.name && item.price);
            })
            .catch(error => {
                console.error(`Error searching ${site.name}:`, error);
                return [];
            });
    });

    try {
        const results = await Promise.all(searchPromises);
        return results.flat();
    } catch (error) {
        console.error('Error in search:', error);
        return [];
    }
}

// Listen for search requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "searchProducts") {
        searchProducts(request.query)
            .then(results => sendResponse({ results }))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Required for async response
    }
});

function fetchPricesFromOtherSites(productName, currentSite) {
    return Promise.all(
        supportedSites
            .filter(site => site.domain !== currentSite)
            .map(site => new Promise(resolve => {
                const searchUrl = site.searchUrl.replace("{query}", encodeURIComponent(productName));
                chrome.tabs.create({ url: searchUrl, active: false }, tab => {
                    const tabId = tab.id;
                    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
                        if (updatedTabId === tabId && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: scrapePrice,
                                args: [site]
                            }, (results) => {
                                chrome.tabs.remove(tabId);
                                let price = "Not Found";
                                if (chrome.runtime.lastError) {
                                    console.error(`Error scraping ${site.domain}:`, chrome.runtime.lastError);
                                } else if (results && results[0] && results[0].result) {
                                    price = results[0].result.price || "Not Found";
                                }
                                resolve({ site: site.domain, price });
                            });
                        }
                    });
                });
            }))
    ).catch(err => {
        console.error("Error fetching prices:", err);
        return [];
    });
}

function scrapePrice(site) {
    const firstResult = document.querySelector(site.searchResultsContainer);
    if (!firstResult) return null;
    const priceElement = firstResult.querySelector(site.priceSelector);
    return { price: priceElement?.innerText.trim() || "Not Found" };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);
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
            return;
        }
        chrome.storage.local.set({ productData: message.data }, () => {
            console.log("Product data saved successfully");
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.action === "comparePrices") {
        const { productName, site } = message.data;
        fetchPricesFromOtherSites(productName, site).then(prices => {
            sendResponse({ prices });
        });
        return true;
    }

    if (message.action === "getSupportedSites") {
        sendResponse({ supportedSites });
    }

    if (message.action === "fetchData") {
        sendResponse({ success: true, data: "Sample Data" });
    }
    return true;
});

// Listen for messages from website
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    console.log("External message received in background script:", message);
    
    // Handle login/signup success messages
    if (message.type === 'LOGIN_SUCCESS' || message.type === 'SIGNUP_SUCCESS') {
        console.log("Auth success message received, storing token");
        
        // Store the token
        chrome.storage.local.set({ token: message.token }, () => {
            console.log("Token stored successfully");
            sendResponse({ success: true });
            
            // Notify any open popup
            chrome.runtime.sendMessage({
                action: "auth_success",
                token: message.token
            });
        });
        
        return true; // Keep the messaging channel open for the async response
    }
    
    return false;
});