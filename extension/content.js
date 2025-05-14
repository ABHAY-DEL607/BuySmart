(function () {
    function getProductData() {
        let productName, productPrice, site, discount, specialOffer;

        const url = window.location.href;
        if (url.includes("flipkart.com")) {
            site = "Flipkart";
            productName = document.querySelector("span.B_NuCI")?.innerText || "Unknown Product";
            productPrice = document.querySelector("div._30jeq3._16Jk6d")?.innerText || "N/A";
            discount = document.querySelector("div._3Ay6Sb span")?.innerText || "";
            specialOffer = document.querySelector("div._2Tpdn3._18hQoS")?.innerText || "";
        } else if (url.includes("amazon.in")) {
            site = "Amazon";
            productName = document.querySelector("#productTitle")?.innerText || "Unknown Product";
            productPrice = document.querySelector("span.a-price-whole")?.innerText || "N/A";
            discount = document.querySelector(".savingsPercentage")?.innerText || "";
            specialOffer = document.querySelector(".a-section .a-text-bold")?.innerText || "";
        } else if (url.includes("paytmmall.com")) {
            site = "Paytm Mall";
            productName = document.querySelector("h1.NZJI")?.innerText || "Unknown Product";
            productPrice = document.querySelector("span._1V3w")?.innerText || "N/A";
            discount = document.querySelector(".discount")?.innerText || "";
            specialOffer = document.querySelector(".offer-text")?.innerText || "";
        } else if (url.includes("ebay.com")) {
            site = "eBay";
            productName = document.querySelector("h1.x-item-title__mainTitle")?.innerText || "Unknown Product";
            productPrice = document.querySelector("span.x-price-primary")?.innerText || "N/A";
            discount = document.querySelector(".d-bin-discount")?.innerText || "";
            specialOffer = document.querySelector(".d-bin-special-offer")?.innerText || "";
        } else if (url.includes("jiomart.com")) {
            site = "JioMart";
            productName = document.querySelector("h1.title")?.innerText || "Unknown Product";
            productPrice = document.querySelector("div.price-box span.final-price")?.innerText || "N/A";
            discount = document.querySelector(".discount")?.innerText || "";
            specialOffer = document.querySelector(".offer")?.innerText || "";
        } else {
            return null;
        }

        return {
            productName: productName.trim(),
            productPrice: productPrice.trim(),
            site,
            discount: discount.trim(),
            specialOffer: specialOffer.trim()
        };
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "getProductData") {
            // Get product data from the current page
            const productData = {
                productName: document.querySelector('h1')?.textContent || 'Unknown Product',
                productPrice: document.querySelector('[data-price]')?.textContent || 'Price not available',
                site: window.location.hostname,
                discount: document.querySelector('.discount')?.textContent || null,
                specialOffer: document.querySelector('.special-offer')?.textContent || null
            };
            
            sendResponse({ data: productData });
        }
        return true; // Keep the message channel open for async response
    });

    // Send product data on page load
    const data = getProductData();
    if (data) {
        chrome.runtime.sendMessage({ action: "productData", data });
    }
})();