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
        domain: "ebay.com",
        name: "eBay",
        productNameSelector: "h1.x-item-title__mainTitle",
        productPriceSelector: "span.x-price-primary",
        searchUrl: "https://www.ebay.com/sch/i.html?_nkw={query}",
        searchResultsContainer: "li.s-item",
        titleSelector: "div.s-item__title",
        priceSelector: "span.s-item__price",
        imageSelector: "img.s-item__image-img",
        ratingSelector: "div.x-star-rating",
        discountSelector: "div.s-item__discount"
    }
];

async function searchProducts(query, productLink) {
    const searchPromises = supportedSites.map(site => {
        const searchUrl = productLink && productLink.includes(site.domain) ? productLink : site.searchUrl.replace('{query}', encodeURIComponent(query));
        return fetch(searchUrl, { credentials: 'omit' })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const results = doc.querySelectorAll(site.searchResultsContainer);
                return Array.from(results).map(result => ({
                    site: site.name,
                    name: result.querySelector(site.titleSelector)?.textContent.trim() || 'Unknown Product',
                    price: result.querySelector(site.priceSelector)?.textContent.trim() || 'N/A',
                    image: result.querySelector(site.imageSelector)?.src || '',
                    rating: result.querySelector(site.ratingSelector)?.textContent.trim() || '',
                    discount: result.querySelector(site.discountSelector)?.textContent.trim() || '',
                    url: result.querySelector('a')?.href || searchUrl
                })).filter(item => item.name && item.price !== 'N/A');
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
        console.error('Search error:', error);
        return [];
    }
}

async function fetchPricesFromOtherSites(productName, currentSite) {
    const results = await Promise.all(
        supportedSites
            .filter(site => site.domain !== currentSite)
            .map(site => new Promise(resolve => {
                const searchUrl = site.searchUrl.replace("{query}", encodeURIComponent(productName));
                chrome.tabs.create({ url: searchUrl, active: false }, tab => {
                    const tabId = tab.id;
                    const listener = (updatedTabId, info) => {
                        if (updatedTabId === tabId && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: (site) => {
                                    const firstResult = document.querySelector(site.searchResultsContainer);
                                    if (!firstResult) return null;
                                    return {
                                        price: firstResult.querySelector(site.priceSelector)?.innerText.trim() || 'Not Found',
                                        image: firstResult.querySelector(site.imageSelector)?.src || ''
                                    };
                                },
                                args: [site]
                            }, (results) => {
                                chrome.tabs.remove(tabId);
                                let result = { site: screen.name, price: 'Not Found', image: '' };
                                if (!chrome.runtime.lastError && results && results[0] && results[0].result) {
                                    result = { site: site.name, price: results[0].result.price, image: results[0].result.image };
                                }
                                resolve(result);
                            });
                        }
                    };
                    chrome.tabs.onUpdated.addListener(listener);
                });
            }))
    );
    return results;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received:", message);

    if (message.action === "openAuth") {
        chrome.windows.create({
            url: message.url,
            type: 'popup',
            width: 400,
            height: 600
        }, (window) => {
            chrome.windows.onRemoved.addListener(function onWindowClosed(windowId) {
                if (windowId === window.id) {
                    chrome.storage.local.get(['token'], (result) => {
                        if (result.token) {
                            chrome.runtime.sendMessage({ action: 'auth_success', token: result.token });
                        }
                    });
                    chrome.windows.onRemoved.removeListener(onWindowClosed);
                }
            });
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
            chrome.storage.local.set({ token: message.token }, () => {
                console.log("Token stored");
                sendResponse({ success: true });
                chrome.runtime.sendMessage({ action: "auth_success", token: message.token });
            });
            return true;
        }
    }
    sendResponse({ success: false, error: "Invalid message or origin" });
});