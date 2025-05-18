document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const searchInput = document.getElementById("searchInput");
    const productLinkInput = document.getElementById("productLinkInput");
    const searchResults = document.getElementById("searchResults");
    const pricesElement = document.getElementById("prices");
    const resultsDiv = document.getElementById("results");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");
    const smartTipElement = document.getElementById("smartTip");
    const compareButton = document.getElementById("compareButton");

    const API_URL = "http://localhost:5000"; // Replace with production URL
    const WEBSITE_URL = "http://localhost:3000"; // Replace with production URL

    const SUPPORTED_SITES = {
        amazon: {
            name: 'Amazon',
            color: '#FF9900',
            icon: '🛍️',
            baseUrl: 'https://www.amazon.in',
            searchUrl: 'https://www.amazon.in/s?k='
        },
        flipkart: {
            name: 'Flipkart',
            color: '#2874F0',
            icon: '🛒',
            baseUrl: 'https://www.flipkart.com',
            searchUrl: 'https://www.flipkart.com/search?q='
        },
        paytmmall: {
            name: 'Paytm Mall',
            color: '#00BAF2',
            icon: '💰',
            baseUrl: 'https://paytmmall.com',
            searchUrl: 'https://paytmmall.com/shop/search?q='
        },
        jiomart: {
            name: 'JioMart',
            color: '#0078D4',
            icon: '🛒',
            baseUrl: 'https://www.jiomart.com',
            searchUrl: 'https://www.jiomart.com/search/'
        },
        ebay: {
            name: 'eBay',
            color: '#E53238',
            icon: '🏷️',
            baseUrl: 'https://www.ebay.com',
            searchUrl: 'https://www.ebay.com/sch/i.html?_nkw='
        }
    };

    // 3D Background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Smart Tips
    const smartTips = [
        "Smart Tip: Compare prices across multiple sites!",
        "Smart Tip: Check reviews before buying!",
        "Smart Tip: Look for coupon codes!",
        "Smart Tip: Save more with bulk purchases!",
        "Smart Tip: Check for No Cost EMI on Flipkart!",
        "Smart Tip: Look for Authenticity Guarantee on eBay!"
    ];

    let smartTipInterval = null;
    function rotateSmartTip() {
        let index = 0;
        smartTipElement.textContent = smartTips[index];
        if (smartTipInterval) clearInterval(smartTipInterval);
        smartTipInterval = setInterval(() => {
            index = (index + 1) % smartTips.length;
            smartTipElement.textContent = smartTips[index];
        }, 5000);
    }

    // Authentication Check
    if (!window.chrome || !chrome.runtime) {
        statusElement.innerText = "Please enable JavaScript in your browser.";
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        return;
    }

    chrome.storage.local.get(['token'], (result) => {
        if (result.token) {
            authSection.classList.add("hidden");
            priceSection.classList.remove("hidden");
            logoutButton.classList.remove("hidden");
            smartTipElement.classList.add("hidden");
            loadPriceComparison();
        } else {
            rotateSmartTip();
        }
    });

    // Authentication Handlers
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
            action: 'openAuth',
            type: 'login',
            url: `${WEBSITE_URL}/login`
        });
    });

    registerButton.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
            action: 'openAuth',
            type: 'register',
            url: `${WEBSITE_URL}/signup`
        });
    });

    logoutButton.addEventListener("click", () => {
        chrome.storage.local.remove("token", () => {
            authSection.classList.remove("hidden");
            priceSection.classList.add("hidden");
            logoutButton.classList.add("hidden");
            smartTipElement.classList.remove("hidden");
            authMessage.innerText = "";
            rotateSmartTip();
        });
    });

    // Listen for Auth Success
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'auth_success' && message.token) {
            chrome.storage.local.set({ token: message.token }, () => {
                authSection.classList.add("hidden");
                priceSection.classList.remove("hidden");
                logoutButton.classList.remove("hidden");
                smartTipElement.classList.add("hidden");
                loadPriceComparison();
            });
        }
    });

    // Search and Comparison
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        const productLink = productLinkInput.value.trim();
        if (!query && !productLink) {
            alert('Please enter a product name or paste a product link');
            return;
        }
        searchProduct(query, productLink);
    });

    compareButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        const productLink = productLinkInput.value.trim();
        if (!query && !productLink) {
            alert('Please enter a product name or paste a product link');
            return;
        }
        resultsDiv.innerHTML = '<div class="loading-container"><div class="loading"></div><p>Comparing prices...</p></div>';
        try {
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    action: "comparePrices",
                    data: { productName: query, site: null, productLink }
                }, resolve);
            });

            if (!response || !response.prices) {
                resultsDiv.innerHTML = '<div class="error-message">Error fetching comparisons</div>';
                return;
            }

            resultsDiv.innerHTML = response.prices.map(({ site, price }) => `
                <div class="price-comparison">
                    <span class="site-name">${site}</span>
                    <span class="price-value">${price}</span>
                </div>
            `).join('');
        } catch (error) {
            resultsDiv.innerHTML = '<div class="error-message">Failed to fetch comparisons</div>';
            console.error('Comparison error:', error);
        }
    });

    async function searchProduct(query, productLink) {
        searchResults.innerHTML = '<div class="loading-container"><div class="loading"></div><p>Searching across all sites...</p></div>';
        try {
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ action: "searchProducts", query, productLink }, resolve);
            });

            if (response.error || !response.results) {
                searchResults.innerHTML = '<div class="error-message">Error searching products</div>';
                statusElement.textContent = 'Error searching products';
                return;
            }

            displaySearchResults(response.results);
            statusElement.textContent = 'Search complete';
        } catch (error) {
            searchResults.innerHTML = '<div class="error-message">Error searching products</div>';
            statusElement.textContent = 'Error searching products';
            console.error('Search error:', error);
        }
    }

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<div class="error-message">No results found</div>';
            return;
        }

        const groupedResults = results.reduce((acc, product) => {
            if (!acc[product.site]) {
                acc[product.site] = [];
            }
            acc[product.site].push(product);
            return acc;
        }, {});

        Object.entries(groupedResults).forEach(([site, products]) => {
            const siteInfo = SUPPORTED_SITES[site.toLowerCase().replace(' ', '')] || { name: site, color: '#000', icon: '🛒' };
            const siteSection = document.createElement('div');
            siteSection.className = 'site-section';
            siteSection.style.borderColor = siteInfo.color;

            const siteHeader = document.createElement('div');
            siteHeader.className = 'site-header';
            siteHeader.innerHTML = `
                <span class="site-icon">${siteInfo.icon}</span>
                <span class="site-name">${siteInfo.name}</span>
            `;
            siteSection.appendChild(siteHeader);

            const productsList = document.createElement('div');
            productsList.className = 'products-list';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image" 
                        onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'#f3f4f6\\'></rect><text x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\' fill=\\'#6b7280\\'>No Image</text></svg>'">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">₹${product.price ? product.price.toLocaleString() : 'N/A'}</div>
                        <div class="product-rating">${product.rating ? `⭐ ${product.rating}` : 'No ratings'}</div>
                        <a href="${product.url}" target="_blank" class="view-product-btn" style="background-color: ${siteInfo.color}">
                            View on ${siteInfo.name}
                        </a>
                    </div>
                `;
                productsList.appendChild(productCard);
            });

            siteSection.appendChild(productsList);
            searchResults.appendChild(siteSection);
        });
    }

    async function loadPriceComparison() {
        try {
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ action: "getProductData" }, resolve);
            });

            if (!response || !response.data) {
                statusElement.innerText = "No product data available.";
                return;
            }

            const { name, price, site, discount, image, rating, url } = response.data;
            let priceHTML = `
                <div class="product-header">
                    ${image ? `<img src="${image}" alt="${name}" class="product-image">` : ''}
                    <h3>${name}</h3>
                    <p class="current-price"><strong>${site} Price:</strong> ₹${price}</p>
                </div>
            `;

            if (discount) {
                priceHTML += `<p class="discount-badge"><strong>Discount:</strong> ${discount}</p>`;
            }
            if (rating) {
                priceHTML += `<p class="product-rating"><strong>Rating:</strong> ⭐ ${rating}</p>`;
            }
            if (site.toLowerCase().includes("flipkart")) {
                priceHTML += `<p class="benefit-tag"><em>Eligible for Flipkart Plus benefits and No Cost EMI!</em></p>`;
            } else if (site.toLowerCase().includes("ebay")) {
                priceHTML += `<p class="benefit-tag"><em>Comes with eBay Authenticity Guarantee!</em></p>`;
            }

            priceHTML += `<div class="comparison-header"><strong>Comparing Prices...</strong></div>`;
            pricesElement.innerHTML = priceHTML;

            const comparisonResponse = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ 
                    action: "comparePrices", 
                    data: { productName: name, site } 
                }, resolve);
            });

            if (!comparisonResponse || !comparisonResponse.prices) {
                pricesElement.innerHTML += "<p class='error-message'>Error fetching prices.</p>";
                return;
            }

            let comparisons = comparisonResponse.prices.map(({ site, price }) => `
                <div class="price-comparison">
                    <span class="site-name">${site}</span>
                    <span class="price-value">₹${price}</span>
                </div>
            `).join('');
            pricesElement.innerHTML += `<div class="comparison-list">${comparisons}</div>`;
            saveButton.classList.remove("hidden");

            saveButton.addEventListener("click", async () => {
                try {
                    const response = await fetch(`${API_URL}/api/prices`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            productName: name,
                            currentSite: site,
                            currentPrice: price,
                            comparisons: comparisonResponse.prices,
                            productImage: image,
                            productUrl: url
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    alert("Price history saved successfully!");
                    console.log("Price history saved:", data);
                } catch (err) {
                    console.error("Error saving history:", err);
                    alert("Error saving price history.");
                }
            });
        } catch (error) {
            console.error("Error in price comparison:", error);
            statusElement.innerText = "Error loading price comparison.";
        }
    }
});