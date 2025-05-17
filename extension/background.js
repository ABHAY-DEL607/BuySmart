const supportedSites = [
    {
        domain: "flipkart.com",
        productNameSelector: "span.B_NuCI",
        productPriceSelector: "div._30jeq3._16Jk6d",
        searchUrl: "https://www.flipkart.com/search?q={query}",
        searchResultsContainer: "div._1AtVbE.col-12-12",
        titleSelector: "div._4rR01T",
        priceSelector: "div._30jeq3._1_WHN1"
    },
    {
        domain: "amazon.in",
        productNameSelector: "#productTitle",
        productPriceSelector: "span.a-price-whole",
        searchUrl: "https://www.amazon.in/s?k={query}",
        searchResultsContainer: "div.s-result-item.s-asin",
        titleSelector: "span.a-size-medium",
        priceSelector: "span.a-price-whole"
    },
    {
        domain: "paytmmall.com",
        productNameSelector: "h1.NZJI",
        productPriceSelector: "span._1V3w",
        searchUrl: "https://paytmmall.com/shop/search?q={query}",
        searchResultsContainer: "div._3WhJ",
        titleSelector: "div._2apC",
        priceSelector: "span._1kMS"
    },
    {
        domain: "ebay.com",
        productNameSelector: "h1.x-item-title__mainTitle",
        productPriceSelector: "span.x-price-primary",
        searchUrl: "https://www.ebay.com/sch/i.html?_nkw={query}",
        searchResultsContainer: "li.s-item",
        titleSelector: "div.s-item__title",
        priceSelector: "span.s-item__price"
    },
    {
        domain: "jiomart.com",
        productNameSelector: "h1.title",
        productPriceSelector: "div.price-box span.final-price",
        searchUrl: "https://www.jiomart.com/search/{query}",
        searchResultsContainer: "div.product-item",
        titleSelector: "div.product-name",
        priceSelector: "span.final-price"
    }
];

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
        isAuthenticated().then(authenticated => {
            if (!authenticated) {
                sendResponse({ error: "User not authenticated" });
                return;
            }
            const { productName, site } = message.data;
            fetchPricesFromOtherSites(productName, site).then(prices => {
                sendResponse({ prices });
            });
        });
        return true;
    }

    if (message.action === "getSupportedSites") {
        sendResponse({ supportedSites });
    }

    if (message.action === "fetchData") {
        sendResponse({ success: true, data: "Sample Data" });
    }
<<<<<<< HEAD
    return true; // Keeps the message port open for async responses
});

// Add this function to your existing background.js
function isAuthenticated() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['token'], (result) => {
            resolve(!!result.token);
        });
    });
}
=======
    return true;
});
<<<<<<< HEAD

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
=======
>>>>>>> 445aef37f197c5cdba226b30b59683ed5b963ffa
>>>>>>> 68afcd953c83c0496b1f23f5060313cbea25f1e3
