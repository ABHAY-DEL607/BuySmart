(function () {
    // Ensure chrome.runtime is defined and accessible
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
        return; // Silently exit if not in Chrome extension context
    }

    const supportedSites = [
        {
            domain: "amazon.in",
            name: "Amazon",
            productNameSelector: "#productTitle",
            productPriceSelector: "span.a-price-whole",
            imageSelector: "img#landingImage",
            ratingSelector: "span.a-icon-alt",
            discountSelector: "span.a-size-large.a-color-price"
        },
        {
            domain: "flipkart.com",
            name: "Flipkart",
            productNameSelector: "span.B_NuCI",
            productPriceSelector: "div._30jeq3._16Jk6d",
            imageSelector: "img._396cs4",
            ratingSelector: "div._3LWZlK",
            discountSelector: "div._3Ay6Sb"
        },
        {
            domain: "paytmmall.com",
            name: "Paytm Mall",
            productNameSelector: "h1.NZJI",
            productPriceSelector: "span._1V3w",
            imageSelector: "img._3togXc",
            ratingSelector: "div._1lRcqv",
            discountSelector: "div._3DWFGc"
        },
        {
            domain: "jiomart.com",
            name: "JioMart",
            productNameSelector: "h1.title",
            productPriceSelector: "div.price-box span.final-price",
            imageSelector: "img.product-image",
            ratingSelector: "div.rating-box",
            discountSelector: "div.discount-label"
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
            const productName = document.querySelector(site.productNameSelector)?.textContent.trim() || 'Unknown Product';
            const productPrice = document.querySelector(site.productPriceSelector)?.textContent.trim() || 'N/A';
            const productImage = document.querySelector(site.imageSelector)?.src || '';
            const rating = document.querySelector(site.ratingSelector)?.textContent.trim() || '';
            const discount = document.querySelector(site.discountSelector)?.textContent.trim() || '';

            if (!productName || productPrice === 'N/A') return null;

            return {
                name: productName,
                price: productPrice,
                site: site.name,
                image: productImage,
                rating,
                discount,
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
        }
        return true;
    });

    const data = getProductData();
    if (data) {
        chrome.runtime.sendMessage({ action: "productData", data });
    }
})();