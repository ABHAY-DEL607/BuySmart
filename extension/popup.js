document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const pricesElement = document.getElementById("prices");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");
    const smartTipElement = document.getElementById("smartTip");
    const productLinkInput = document.getElementById('productLinkInput');
    const compareButton = document.getElementById('compareButton');
    const resultsDiv = document.getElementById('results');

    const API_URL = "http://localhost:5000";
    const WEBSITE_URL = "http://localhost:3000";
    
    // Define supported sites with their properties
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
            searchUrl: 'https://paytmmall.com/search?q='
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

    // Initialize 3D background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle system for 3D background
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
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

        // Create particles
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Animation loop
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

    function openAuthWindow(url) {
        const width = 400;
        const height = 600;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        const authWindow = window.open(
            url, 
            "auth_window",
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );

        // Add event listener for window close
        const checkWindow = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(checkWindow);
                // Check if we have a token after window closes
                const token = localStorage.getItem('token');
                if (token) {
                    authSection.classList.add("hidden");
                    priceSection.classList.remove("hidden");
                    logoutButton.classList.remove("hidden");
                    smartTipElement.classList.add("hidden");
                    loadPriceComparison();
                }
            }
        }, 500);
    }

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

    if (!window.chrome || !chrome.runtime) {
        statusElement.innerText = "Please enable JavaScript in your browser to use this extension.";
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        return;
    }

    const token = localStorage.getItem("token");
    if (token) {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        smartTipElement.classList.add("hidden");
        loadPriceComparison();
    } else {
        rotateSmartTip();
    }

    // Add click event listeners for login and register buttons
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            console.log('Login button clicked, opening auth window');
            localStorage.setItem('return_to_extension', 'true');
            openAuthWindow(`${WEBSITE_URL}/login`);
        });
    }

    if (registerButton) {
        registerButton.addEventListener("click", () => {
            console.log('Register button clicked, opening auth window');
            localStorage.setItem('return_to_extension', 'true');
            openAuthWindow(`${WEBSITE_URL}/signup`);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            authSection.classList.remove("hidden");
            priceSection.classList.add("hidden");
            logoutButton.classList.add("hidden");
            smartTipElement.classList.remove("hidden");
            authMessage.innerText = "";
            rotateSmartTip();
        });
    }

    // Listen for messages from the auth window (window.postMessage)
    window.addEventListener('message', function(event) {
        if (event.origin === WEBSITE_URL || event.origin === 'http://localhost:3000') {
            if (event.data.type === 'LOGIN_SUCCESS' || event.data.type === 'SIGNUP_SUCCESS') {
                if (event.data.token) {
                    localStorage.setItem('token', event.data.token);
                    authSection.classList.add("hidden");
                    priceSection.classList.remove("hidden");
                    logoutButton.classList.remove("hidden");
                    smartTipElement.classList.add("hidden");
                    loadPriceComparison();
                }
            }
        }
    });

    // Listen for messages from chrome.runtime (chrome.runtime.sendMessage)
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            if (message && (message.type === 'LOGIN_SUCCESS' || message.type === 'SIGNUP_SUCCESS')) {
                if (message.token) {
                    localStorage.setItem('token', message.token);
                    authSection.classList.add("hidden");
                    priceSection.classList.remove("hidden");
                    logoutButton.classList.remove("hidden");
                    smartTipElement.classList.add("hidden");
                    loadPriceComparison();
                }
            }
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

            const { productName, productPrice, site, discount, specialOffer, productImage } = response.data;
            let priceHTML = `
                <div class="product-header">
                    ${productImage ? `<img src="${productImage}" alt="${productName}" class="product-image">` : ''}
                    <h3>${productName}</h3>
                    <p class="current-price"><strong>${site} Price:</strong> ${productPrice}</p>
                </div>
            `;

            if (discount) {
                priceHTML += `<p class="discount-badge"><strong>Discount:</strong> ${discount}</p>`;
            }
            if (specialOffer) {
                priceHTML += `<p class="special-offer"><strong>Special Offer:</strong> ${specialOffer}</p>`;
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
                    data: { productName, site } 
                }, resolve);
            });

            if (!comparisonResponse || !comparisonResponse.prices) {
                pricesElement.innerHTML += "<p class='error-message'>Error fetching prices.</p>";
                return;
            }

            let comparisons = comparisonResponse.prices.map(({ site, price, image }) => {
                return `<div class="price-comparison">
                    ${image ? `<img src="${image}" alt="${site}" class="site-icon">` : ''}
                    <span class="site-name">${site}</span>
                    <span class="price-value">${price}</span>
                </div>`;
            }).join("");
            
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
                            productName: productName,
                            currentSite: site,
                            currentPrice: productPrice,
                            comparisons: comparisonResponse.prices,
                            productImage: productImage
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
                    alert("Error saving price history. Please try again.");
                }
            });
        } catch (error) {
            console.error("Error in price comparison:", error);
            statusElement.innerText = "Error loading price comparison.";
        }
    }

    // Function to fetch real-time data from all supported sites
    async function fetchRealTimeData(query, productLink) {
        const results = {};
        const loadingPromises = [];

        for (const [siteId, site] of Object.entries(SUPPORTED_SITES)) {
            const searchUrl = productLink || `${site.searchUrl}${encodeURIComponent(query)}`;
            loadingPromises.push(
                fetch(`${API_URL}/api/scrape/${siteId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        query, 
                        url: searchUrl,
                        productUrl: productLink 
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.products && data.products.length > 0) {
                        results[siteId] = {
                            site: site,
                            products: data.products
                        };
                    }
                })
                .catch(error => {
                    console.error(`Error fetching from ${site.name}:`, error);
                })
            );
        }

        await Promise.all(loadingPromises);
        return results;
    }

    // Function to display search results
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (Object.keys(results).length === 0) {
            resultsContainer.innerHTML = '<div class="error-message">No results found</div>';
            return;
        }

        for (const [siteId, data] of Object.entries(results)) {
            const site = data.site;
            const products = data.products;

            const siteSection = document.createElement('div');
            siteSection.className = 'site-section';
            siteSection.style.borderColor = site.color;

            const siteHeader = document.createElement('div');
            siteHeader.className = 'site-header';
            siteHeader.innerHTML = `
                <span class="site-icon">${site.icon}</span>
                <span class="site-name">${site.name}</span>
            `;
            siteSection.appendChild(siteHeader);

            const productsList = document.createElement('div');
            productsList.className = 'products-list';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image" 
                        onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' fill=\'%23f3f4f6\'/><text x=\'50\' y=\'50\' font-family=\'Arial\' font-size=\'12\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%236b7280\'>No Image</text></svg>'">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">₹${product.price ? product.price.toLocaleString() : 'N/A'}</div>
                        <div class="product-rating">
                            ${product.rating ? `⭐ ${product.rating} (${product.reviews} reviews)` : 'No ratings'}
                        </div>
                        <div class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <a href="${product.url}" target="_blank" class="view-product-btn" style="background-color: ${site.color}">
                            View on ${site.name}
                        </a>
                    </div>
                `;
                productsList.appendChild(productCard);
            });

            siteSection.appendChild(productsList);
            resultsContainer.appendChild(siteSection);
        }
    }

    // Function to handle search
    async function searchProduct(query, productLink) {
        const resultsContainer = document.getElementById('searchResults');
        const statusElement = document.getElementById('status');
        
        // Show loading state
        resultsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading"></div>
                <p>Searching across all sites...</p>
                <div class="site-loading-indicators">
                    ${Object.values(SUPPORTED_SITES).map(site => `
                        <div class="site-loading">
                            <span>${site.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        try {
            const results = await fetchRealTimeData(query, productLink);
            displaySearchResults(results);
            if (statusElement) statusElement.textContent = 'Search complete';
        } catch (error) {
            console.error('Error searching products:', error);
            resultsContainer.innerHTML = '<div class="error-message">Error searching products. Please try again.</div>';
            if (statusElement) statusElement.textContent = 'Error searching products';
        }
    }

    // Add event listener for search form
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput').value.trim();
        const productLink = document.getElementById('productLinkInput').value.trim();
        
        if (!query && !productLink) {
            alert('Please enter a product name or paste a product link');
            return;
        }
        
        searchProduct(query, productLink);
    });

    compareButton.addEventListener('click', async () => {
        const searchQuery = searchInput.value.trim();
        const productLink = productLinkInput.value.trim();
        if (!searchQuery && !productLink) {
            alert('Please enter a product name or paste a product link');
            return;
        }

        resultsDiv.innerHTML = 'Loading...';
        try {
            const sites = ['amazon', 'flipkart', 'ebay', 'jiomart', 'paytmmall'];
            const results = await Promise.all(
                sites.map(site =>
                    fetch(`http://localhost:5001/api/scrape/${site}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: searchQuery, productUrl: productLink })
                    }).then(res => res.json())
                )
            );

            resultsDiv.innerHTML = '';
            results.forEach((result, index) => {
                if (result.length > 0) {
                    const product = result[0];
                    resultsDiv.innerHTML += `
                        <div>
                            <h3>${product.source}</h3>
                            <p>Name: ${product.name}</p>
                            <p>Price: ${product.price}</p>
                            <p>Delivery: ${product.delivery}</p>
                            <p>Rating: ${product.rating}/5</p>
                        </div>
                    `;
                }
            });
        } catch (error) {
            resultsDiv.innerHTML = 'Failed to fetch comparisons';
            console.error(error);
        }
    });
});