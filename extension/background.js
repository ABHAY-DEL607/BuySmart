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

// Updated fetchPricesFromOtherSites to wait for the tab to fully load
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
                                    console.error(chrome.runtime.lastError);
                                } else if (results && results[0] && results[0].result) {
                                    price = results[0].result.price || "Not Found";
                                }
                                resolve({ site: site.domain, price });
                            });
                        }
                    });
                });
            }))
    );
}

function scrapePrice(site) {
    const firstResult = document.querySelector(site.searchResultsContainer);
    if (!firstResult) return null;
    const priceElement = firstResult.querySelector(site.priceSelector);
    return { price: priceElement?.innerText.trim() };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getProductData") {
        chrome.storage.local.get(["productData"], (result) => {
            sendResponse({ data: result.productData || null });
        });
        return true;
    }

    if (message.action === "productData") {
        if (!message.data) {
            console.error("Received empty product data");
            return;
        }
        chrome.storage.local.set({ productData: message.data }, () => {
            console.log("Product data saved successfully");
        });
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
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received: ", message);
    if (message.action === "fetchData") {
        sendResponse({ success: true, data: "Sample Data" });
    }
    return true; // Keeps the message port open for async responses
});
